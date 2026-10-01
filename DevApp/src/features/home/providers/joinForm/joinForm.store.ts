import type { PersistedStoreApi } from '@/utils'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createStore } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { JoinMode } from '../../hooks'

type State = {
  mode: JoinMode
  callDestination: string
  conferenceDestination: string
  sendVideo: boolean
  receiveVideo: boolean
  muteAudio: boolean
}

export const JOIN_FORM_EMPTY: State = {
  mode: 'call',
  callDestination: '',
  conferenceDestination: '',
  sendVideo: false,
  receiveVideo: false,
  muteAudio: false
}

type Actions = {
  setProperty: <P extends keyof State>(property: P, value: State[P]) => void
}

export type JoinFormStoreState = State & Actions
export type JoinFormStore = PersistedStoreApi<JoinFormStoreState, State>

export const createJoinFormStore = (): JoinFormStore =>
  createStore<JoinFormStoreState>()(
    persist(
      (set) => ({
        ...JOIN_FORM_EMPTY,

        setProperty: (property, value) => {
          set({ [property]: value })
        }
      }),
      {
        name: 'joinForm',
        storage: createJSONStorage<State>(() => AsyncStorage),
        partialize: (state): State => ({
          mode: state.mode,
          callDestination: state.callDestination,
          conferenceDestination: state.conferenceDestination,
          sendVideo: state.sendVideo,
          receiveVideo: state.receiveVideo,
          muteAudio: state.muteAudio
        })
      }
    )
  )
