import type { Provider } from '@/providers/provider.types'
import { sdkService } from '@/services/sdk'
import { createContext, useEffect, useRef, useState } from 'react'
import { Alert } from 'react-native'
import { useActiveSession } from '../activeSession'
import {
  createPendingIncomingCallStore,
  type PendingIncomingCallStore
} from './pendingIncomingCall.store'

export const PendingIncomingCallContext =
  createContext<PendingIncomingCallStore | null>(null)

export const PendingIncomingCallProvider: Provider = ({ children }) => {
  const activeSessionId = useActiveSession((s) => s.activeSessionId)
  const activeSessionIdRef = useRef(activeSessionId)
  activeSessionIdRef.current = activeSessionId

  const [store] = useState(() =>
    createPendingIncomingCallStore({
      callManager: sdkService.callManager,
      isActiveSessionExists: () => activeSessionIdRef.current !== null,
      onWrongCallState: ({ callId, state }) => {
        Alert.alert('Wrong call state', JSON.stringify({ callId, state }))
      }
    })
  )

  useEffect(() => {
    return () => store.destroy()
  }, [store])

  return (
    <PendingIncomingCallContext.Provider value={store}>
      {children}
    </PendingIncomingCallContext.Provider>
  )
}
