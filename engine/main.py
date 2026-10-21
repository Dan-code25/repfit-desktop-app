import asyncio
import json
import os
import secrets
import sys
import threading

from websockets.asyncio.server import serve
from websockets.exceptions import ConnectionClosed


async def main():
    shutdown = asyncio.Event()
    loop = asyncio.get_running_loop()
    token = secrets.token_urlsafe(32)
    active_client = None

    def watch_parent():
        # Raw reads avoid holding a buffered stdin lock during interpreter exit.
        while os.read(sys.stdin.fileno(), 1):
            pass
        if not loop.is_closed():
            loop.call_soon_threadsafe(shutdown.set)

    async def handle_client(websocket):
        nonlocal active_client
        try:
            raw = await asyncio.wait_for(websocket.recv(), timeout=5)
            authentication = json.loads(raw) if isinstance(raw, str) else None
            if (
                not isinstance(authentication, dict)
                or authentication.get("type") != "authenticate"
                or not isinstance(authentication.get("token"), str)
                or not secrets.compare_digest(authentication["token"], token)
            ):
                await websocket.close(1008, "Authentication required")
                return
        except (ValueError, TypeError, asyncio.TimeoutError, ConnectionClosed):
            await websocket.close(1008, "Authentication required")
            return

        if active_client is not None:
            await websocket.close(1008, "Engine already has a client")
            return
        active_client = websocket
        try:
            await websocket.send(json.dumps({"type": "authenticated"}))
            async for raw in websocket:
                try:
                    command = json.loads(raw) if isinstance(raw, str) else None
                except ValueError:
                    await websocket.send(json.dumps({"type": "error", "message": "Expected valid JSON."}))
                    continue

                if not isinstance(command, dict) or not isinstance(command.get("type"), str):
                    reply = {"type": "error", "message": "Expected an object with a string type."}
                elif command["type"] == "ping":
                    reply = {"type": "pong"}
                elif command["type"] == "shutdown":
                    return
                else:
                    reply = {"type": "error", "message": "Unknown command."}
                await websocket.send(json.dumps(reply))
        except ConnectionClosed:
            pass
        finally:
            active_client = None
            shutdown.set()

    async with serve(
        handle_client, "127.0.0.1", 0,
        origins=[None], compression=None, max_size=4096, max_queue=4,
        open_timeout=5, close_timeout=1,
    ) as server:
        threading.Thread(target=watch_parent, name="repfit-parent", daemon=True).start()
        print(json.dumps({
            "type": "engine_ready", "port": server.sockets[0].getsockname()[1], "token": token,
        }), flush=True)
        await shutdown.wait()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except (BrokenPipeError, KeyboardInterrupt):
        pass
