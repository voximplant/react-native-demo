import { useStrictContext } from '../utils/useStrictContext'
import { useStore } from 'zustand'
import type { MediaStoreState } from './media.store'
import { MediaContext } from './MediaProvider'

export const useMedia = <T>(selector: (state: MediaStoreState) => T): T => {
  const store = useStrictContext(MediaContext, 'useMedia')

  return useStore(store, selector)
}
