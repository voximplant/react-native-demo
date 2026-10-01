import { useStrictContext } from '@/providers/utils'
import { useStore } from 'zustand'
import type { IncomingCallStoreState } from '../../store'
import { IncomingCallContext } from './IncomingCallProvider'

export const useIncomingCall = <T>(
  selector: (state: IncomingCallStoreState) => T
): T => {
  const store = useStrictContext(IncomingCallContext, 'useIncomingCall')

  return useStore(store, selector)
}
