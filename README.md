# repfit-desktop

An Electron application with React and TypeScript

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

Electron main starts `engine/main.py` with `engine/.venv/Scripts/python.exe`
when available, otherwise `python` from PATH (Python 3.11). This connection-only
engine requires the pinned `websockets==16.0` package; camera packages are not
needed yet. Install the connection dependency into the Python environment used
to run or build the engine with `python -m pip install websockets==16.0`.

Python opens a WebSocket server on `127.0.0.1` with an automatically assigned
port. Its single stdout JSON line contains `type: "engine_ready"`, the `port`,
and a temporary `token`. Electron main connects to that local port and sends
`{"type":"authenticate","token":"..."}`. After Python replies
`{"type":"authenticated"}`, Electron sends `{"type":"ping"}` and Python
replies `{"type":"pong"}`. The terminal then shows
`[engine] WebSocket connected: ping → pong`. The token is never logged.

On app quit, Electron sends `{"type":"shutdown"}` through WebSocket and waits
for Python to exit, forcing termination after three seconds if needed. Python
also exits when the authenticated client disconnects or its stdin pipe closes.
The stdin pipe is retained only to detect parent exit; commands use WebSocket.
Diagnostics belong on stderr; stdout is reserved for startup information.

### Build

The Windows build uses PyInstaller (development tool, currently 6.16.0) to
produce `engine/dist/repfit-engine.exe` and bundles it under the installed
app's resources. Users of the installed app do not need Python.
`npm run build:engine` builds only the engine; `npm run build:win` builds both.

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
