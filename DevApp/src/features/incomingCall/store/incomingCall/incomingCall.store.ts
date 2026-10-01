import { attachLifecycle, type StoreWithLifecycle } from '@/utils'
import {
  RejectMode,
  type Call,
  type CallId,
  type CallSettings,
  type CallState
} from '@voximplant/react-native-calls'
import type { WatchOptions } from '@voximplant/react-native-shared'
import { createStore, type StoreApi } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type State = {
  callId: CallId
  state: CallState
  displayName: string | null
  withVideo: boolean
}

type Actions = {
  mute: (value: boolean) => void
  answer: (settings: CallSettings) => void
  decline: () => void
  busy: () => void
}

export type IncomingCallStoreState = State & Actions
export type IncomingCallStore = StoreApi<IncomingCallStoreState>

export const createIncomingCallStore = (
  call: Call,
  withVideo: boolean
): StoreWithLifecycle<IncomingCallStore> => {
  const ac = new AbortController()
  const subscribeOptions = { signal: ac.signal } satisfies WatchOptions<unknown>

  const store = createStore<IncomingCallStoreState>()(
    immer((set) => {
      call.state.watch(
        (state) =>
          set((s) => {
            s.state = state
          }),
        subscribeOptions
      )
      call.remoteDisplayName.watch(
        (displayName) =>
          set((s) => {
            s.displayName = displayName
          }),
        subscribeOptions
      )

      return {
        callId: call.id,
        state: call.state.value,
        displayName: call.remoteDisplayName.value,
        withVideo: withVideo,

        mute: (value) => {
          call.mute(value)
        },
        answer: (settings) => {
          call.answer(settings)
        },
        busy: () => {
          call.reject(RejectMode.Busy)
        },
        decline: () => {
          call.reject(RejectMode.Decline)
        }
      }
    })
  )

  return attachLifecycle(store, {
    destroy: () => ac.abort()
  })
}
