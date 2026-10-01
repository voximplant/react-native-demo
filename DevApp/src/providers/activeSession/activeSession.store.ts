import { createStore, type StoreApi } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type State = {
  activeSessionId: string | null
}

type Actions = {
  setActiveSession: (sessionId: string) => void
  clearActiveSession: () => void
}

export type ActiveSessionStoreState = State & Actions
export type ActiveSessionStore = StoreApi<ActiveSessionStoreState>

export const createActiveSessionStore = (): ActiveSessionStore =>
  createStore<ActiveSessionStoreState>()(
    immer((set) => ({
      activeSessionId: null,

      setActiveSession: (sessionId) =>
        set((s) => {
          if (s.activeSessionId !== null) return
          s.activeSessionId = sessionId
        }),

      clearActiveSession: () =>
        set((s) => {
          s.activeSessionId = null
        })
    }))
  )
