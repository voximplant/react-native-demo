import { ActiveSessionProvider } from './activeSession'
import { PendingIncomingCallProvider } from './pendingIncomingCall'
import { MediaProvider } from './media'
import { PermissionsProvider } from './permissions'
import type { Provider } from './provider.types'
import { SettingsProvider } from './settings'
import { combineProviders } from './utils/combineProviders'
import { useEffect } from 'react'
import { sdkService } from '@/services/sdk'

const providers = [
  PermissionsProvider,
  SettingsProvider,
  MediaProvider,
  ActiveSessionProvider,
  PendingIncomingCallProvider
]

export const MainProvider: Provider = ({ children }) => {
  useEffect(() => {
    sdkService.initMainServices()
  }, [])

  return combineProviders(providers, children)
}
