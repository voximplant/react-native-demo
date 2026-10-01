import { useStrictContext } from '@/providers/utils'
import { useStore } from 'zustand'
import type { CallStoreState } from '../../store'
import { CallContext } from './CallProvider'

export const useCall = <T>(selector: (state: CallStoreState) => T): T => {
  const store = useStrictContext(CallContext, 'useCall')

  return useStore(store, selector)
}
