import { sdkService } from '@/services/sdk'
import {
  createContext,
  useEffect,
  useState,
  type PropsWithChildren
} from 'react'
import { createSettingsStore, type SettingsStore } from './settings.store'

type SettingsCtx = SettingsStore

export const SettingsContext = createContext<SettingsCtx | null>(null)

export const SettingsProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [store] = useState(() =>
    createSettingsStore({
      audioDeviceManager: sdkService.audioDeviceManager
    })
  )

  useEffect(() => {
    return () => store.destroy()
  }, [store])

  return (
    <SettingsContext.Provider value={store}>
      {children}
    </SettingsContext.Provider>
  )
}
