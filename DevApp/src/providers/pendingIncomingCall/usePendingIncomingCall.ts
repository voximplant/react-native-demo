import { useStore } from 'zustand'
import { useStrictContext } from '../utils'
import type { PendingIncomingCallStoreState } from './pendingIncomingCall.store'
import { PendingIncomingCallContext } from './PendingIncomingCallProvider'

export const usePendingIncomingCall = <T>(
  selector: (state: PendingIncomingCallStoreState) => T
): T => {
  const store = useStrictContext(
    PendingIncomingCallContext,
    'usePendingIncomingCall'
  )

  return useStore(store, selector)
}
