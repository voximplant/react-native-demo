import { useStrictContext } from '../utils'
import { useStore } from 'zustand'
import type { ActiveSessionStoreState } from './activeSession.store'
import { ActiveSessionContext } from './ActiveSessionProvider'

export const useActiveSession = <T>(
  selector: (state: ActiveSessionStoreState) => T
): T => {
  const store = useStrictContext(ActiveSessionContext, 'useActiveSession')

  return useStore(store, selector)
}
