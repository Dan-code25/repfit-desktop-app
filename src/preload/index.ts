import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import type { RepfitApi } from '../shared/types'

// Custom APIs for renderer
const api: RepfitApi = {
  listWorkouts: () => ipcRenderer.invoke('workouts:list'),
  createWorkout: (input) => ipcRenderer.invoke('workouts:create', input),
  updateWorkout: (id, input) => ipcRenderer.invoke('workouts:update', id, input),
  deleteWorkout: (id) => ipcRenderer.invoke('workouts:delete', id)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
