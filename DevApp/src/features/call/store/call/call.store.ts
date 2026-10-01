import { attachLifecycle, logger, type StoreWithLifecycle } from '@/utils'
import { runOptimistic, runOptimisticSync } from '@/utils/optimistic'
import type {
  Call,
  CallId,
  CallState,
  LocalVideoStream
} from '@voximplant/react-native-calls'
import type { WatchOptions } from '@voximplant/react-native-shared'
import { createStore, type StoreApi } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type State = {
  callId: CallId
  state: CallState
  isMuted: boolean
  isOnHold: boolean
  isSendingVideo: boolean
  localVideoStreamId: string | null
  remoteVideoStreamId: string | null
}

type Actions = {
  mute: (value: boolean) => void
  hold: (value: boolean) => Promise<void>
  hangup: () => void
  startSendingVideo: (stream: LocalVideoStream) => Promise<void>
  stopSendingVideo: () => Promise<void>
}

export type CallStoreState = State & Actions
export type CallStore = StoreApi<CallStoreState>

export const createCallStore = (call: Call): StoreWithLifecycle<CallStore> => {
  const ac = new AbortController()
  const subscribeOptions = { signal: ac.signal } satisfies WatchOptions<unknown>

  const store = createStore<CallStoreState>()(
    immer((set) => {
      call.state.watch(
        (state) =>
          set((s) => {
            s.state = state
          }),
        subscribeOptions
      )
      call.isMuted.watch(
        (isMuted) =>
          set((s) => {
            s.isMuted = isMuted
          }),
        subscribeOptions
      )
      call.isOnHold.watch(
        (isOnHold) =>
          set((s) => {
            s.isOnHold = isOnHold
          }),
        subscribeOptions
      )
      call.localVideoStreams.watch((streams) => {
        const stream = streams[0] ?? null
        set((s) => {
          s.localVideoStreamId = stream?.id ?? null
          s.isSendingVideo = !!stream
        })
      }, subscribeOptions)
      call.remoteVideoStreams.watch((streams) => {
        set((s) => {
          s.remoteVideoStreamId = streams[0]?.id ?? null
        })
      }, subscribeOptions)

      return {
        callId: call.id,
        state: call.state.value,
        isMuted: call.isMuted.value,
        isOnHold: call.isOnHold.value,
        isSendingVideo: call.localVideoStreams.value.length > 0,
        localVideoStreamId: call.localVideoStreams.value[0]?.id ?? null,
        remoteVideoStreamId: call.remoteVideoStreams.value[0]?.id ?? null,

        mute: (value: boolean) => {
          if (call.isMuted.value === value) return

          try {
            runOptimisticSync(
              () =>
                set((s) => {
                  s.isMuted = value
                }),
              () => call.mute(value),
              () =>
                set((s) => {
                  s.isMuted = call.isMuted.value
                })
            )
          } catch (err) {
            logger.error('CALL', 'mute failed', { err })
          }
        },
        hold: async (value) => {
          if (call.isOnHold.value === value) return

          try {
            await runOptimistic(
              () =>
                set((s) => {
                  s.isOnHold = value
                }),
              () => call.hold(value),
              () =>
                set((s) => {
                  s.isOnHold = call.isOnHold.value
                })
            )
          } catch (err) {
            logger.error('CALL', 'hold failed', { err })
          }
        },
        hangup: () => call.hangup(),
        startSendingVideo: async (stream) => {
          if (call.localVideoStreams.value.length > 0) return
          await call.startSendingVideo(stream)
        },
        stopSendingVideo: async () => {
          if (call.localVideoStreams.value.length === 0) return
          await call.stopSendingVideo()
        }
      }
    })
  )

  return attachLifecycle(store, {
    destroy: () => ac.abort()
  })
}
