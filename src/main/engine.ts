import { app } from 'electron'
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { createInterface } from 'node:readline'

let engine: ChildProcessWithoutNullStreams | null = null
let connection: WebSocket | null = null
let stopping = false

export function startEngine(): Promise<void> {
  // prevents running multiple child instances
  if (engine) return Promise.reject(new Error('Engine is already running.'))
  stopping = false

  const engineDir = app.isPackaged
    ? join(process.resourcesPath, 'engine')
    : join(__dirname, '../../engine')
  const venvPython = join(engineDir, '.venv/Scripts/python.exe')
  const command = app.isPackaged
    ? join(engineDir, 'repfit-engine.exe')
    : existsSync(venvPython)
      ? venvPython
      : 'python'
  const args = app.isPackaged ? [] : ['-u', join(engineDir, 'main.py')]
  const child = spawn(command, args, { windowsHide: true, stdio: 'pipe' })
  engine = child
  let socket: WebSocket | null = null
  const lines = createInterface({ input: child.stdout })
  child.stderr.on('data', (data: Buffer) => console.error('[engine]', data.toString().trim()))
  child.once('close', (code, signal) => {
    lines.close()
    if (engine === child) {
      engine = null
      connection = null
    }
    socket?.close()
    console.log('[engine] Exited:', signal ?? code)
  })

  return new Promise((resolve, reject) => {
    let connected = false
    let failed = false
    const timeout = setTimeout(() => fail(new Error('Engine connection timed out.')), 5000)

    function fail(error: Error): void {
      if (failed || stopping || engine !== child) return
      failed = true
      clearTimeout(timeout)
      console.error('[engine]', error.message)
      socket?.close()
      child.kill()
      if (!connected) reject(error)
    }

    child.on('error', fail)
    child.stdin.on('error', fail)
    child.once('close', () => {
      clearTimeout(timeout)
      if (!connected) reject(new Error('Engine exited before replying to ping.'))
    })
    lines.on('line', (line) => {
      let message: unknown
      try {
        message = JSON.parse(line)
      } catch {
        fail(new Error('Engine sent invalid JSON.'))
        return
      }
      if (
        typeof message !== 'object' ||
        message === null ||
        !('type' in message) ||
        message.type !== 'engine_ready' ||
        !('port' in message) ||
        typeof message.port !== 'number' ||
        !Number.isInteger(message.port) ||
        message.port < 1 ||
        message.port > 65535 ||
        !('token' in message) ||
        typeof message.token !== 'string' ||
        message.token.length < 32 ||
        message.token.length > 128 ||
        socket !== null
      ) {
        fail(new Error('Engine sent invalid startup information.'))
        return
      }
      if (stopping || failed) return

      const token = message.token
      const client = new WebSocket(`ws://127.0.0.1:${message.port}`)
      socket = client
      let authenticated = false
      client.addEventListener('open', () => {
        if (stopping || failed) return
        client.send(JSON.stringify({ type: 'authenticate', token }))
      })
      client.addEventListener('message', (event) => {
        if (stopping || failed) return
        let reply: unknown
        try {
          if (typeof event.data !== 'string') throw new Error('Expected a text message.')
          reply = JSON.parse(event.data)
        } catch {
          fail(new Error('Engine WebSocket sent invalid JSON.'))
          return
        }
        if (typeof reply !== 'object' || reply === null || !('type' in reply)) {
          fail(new Error('Engine WebSocket sent an invalid message.'))
        } else if (reply.type === 'authenticated' && !authenticated) {
          authenticated = true
          client.send(JSON.stringify({ type: 'ping' }))
        } else if (reply.type === 'pong' && authenticated && !connected) {
          connected = true
          connection = client
          clearTimeout(timeout)
          console.log('[engine] WebSocket connected: ping -> pong')
          resolve()
        } else {
          fail(new Error('Engine WebSocket sent an unexpected message.'))
        }
      })
      client.addEventListener('error', () => fail(new Error('Engine WebSocket connection failed.')))
      client.addEventListener('close', () => fail(new Error('Engine WebSocket disconnected.')))
    })
  })
}

export function stopEngine(): Promise<void> {
  const child = engine
  if (!child) return Promise.resolve()
  stopping = true

  return new Promise((resolve) => {
    const timeout = setTimeout(() => child.kill(), 3000)
    child.once('close', () => {
      clearTimeout(timeout)
      resolve()
    })
    if (connection?.readyState === WebSocket.OPEN) {
      connection.send(JSON.stringify({ type: 'shutdown' }))
    } else if (!child.stdin.destroyed && !child.stdin.writableEnded) {
      child.stdin.end()
    }
  })
}
