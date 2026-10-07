import { ElectronAPI } from '@electron-toolkit/preload'
import type { RepfitApi } from '../shared/types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: RepfitApi
  }
}
