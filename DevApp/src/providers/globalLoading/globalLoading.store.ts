import { createStore, type StoreApi } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type State = {
  isLoading: boolean
}

type Actions = {
  setLoading: (value: boolean) => void
}

export type GlobalLoadingStoreState = State & Actions
export type GlobalLoadingStore = StoreApi<GlobalLoadingStoreState>

export const createGlobalLoadingStore = (): GlobalLoadingStore => {
  let count = 0

  return createStore<GlobalLoadingStoreState>()(
    immer((set) => ({
      isLoading: false,

      setLoading: (value) => {
        count = Math.max(0, count + (value ? 1 : -1))

        set((s) => {
          s.isLoading = count > 0
        })
      }
    }))
  )
}
