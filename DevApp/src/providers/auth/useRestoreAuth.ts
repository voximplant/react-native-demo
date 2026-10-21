import { sdkService } from '@/services/sdk'
import { useIsMounted } from '@/shared/hooks'
import { waitForHydration } from '@/utils'
import { ClientDisconnectReason } from '@voximplant/react-native-core'
import { useEffect, useRef } from 'react'
import { AppState } from 'react-native'
import type { AuthStore } from './auth.store'
import { AuthStatus } from './auth.types'

const RESTORE_CLIENT_REASONS = [
  ClientDisconnectReason.AppMovedToBackground,
  ClientDisconnectReason.ConnectionLost
]

export const useRestoreAuth = (store: AuthStore) => {
  const isMounted = useIsMounted()
  const restoreOnActive = useRef(false)

  useEffect(() => {
    const run = async () => {
      await waitForHydration(store)

      if (!isMounted()) return

      await store.getState().restore()
    }

    run()
  }, [isMounted, store])

  useEffect(() => {
    const ac = new AbortController()

    sdkService.onClientDisconnected(
      (reason) => {
        if (!RESTORE_CLIENT_REASONS.includes(reason)) return
        if (store.getState().status !== AuthStatus.AUTHENTICATED) return
        if (restoreOnActive.current) return

        if (AppState.currentState === 'active') {
          store.getState().restore()
          return
        }

        if (reason === ClientDisconnectReason.AppMovedToBackground) {
          restoreOnActive.current = true
        }
      },
      { signal: ac.signal }
    )

    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active') return
      if (!restoreOnActive.current) return

      restoreOnActive.current = false
      store.getState().restore()
    })

    return () => {
      ac.abort()
      subscription.remove()
    }
  }, [store])
}
