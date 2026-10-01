import { useStore } from 'zustand'
import { useStrictContext } from '../utils/useStrictContext'
import type { GlobalLoadingStoreState } from './globalLoading.store'
import { GlobalLoadingContext } from './GlobalLoadingProvider'

export const useGlobalLoading = <T>(
  selector: (state: GlobalLoadingStoreState) => T
): T => {
  const store = useStrictContext(GlobalLoadingContext, 'useGlobalLoading')

  return useStore(store, selector)
}
