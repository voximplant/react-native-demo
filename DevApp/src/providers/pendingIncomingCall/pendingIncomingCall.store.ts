import type { CallManagerService, OnIncomingCallEvent } from '@/services/sdk'
import { attachLifecycle, logger, type StoreWithLifecycle } from '@/utils'
import {
  CallState,
  RejectMode,
  type CallManagerIncomingCallPayload
} from '@voximplant/react-native-calls'
import { createStore, type StoreApi } from 'zustand'
import { immer } from 'zustand/middleware/immer'

const isTerminalCallState = (state: CallState): boolean =>
  [CallState.Connected, CallState.Disconnected, CallState.Failed].includes(
    state
  )

type PendingIncomingCallStoreParams = {
  callManager: CallManagerService
  isActiveSessionExists: () => boolean
  onWrongCallState: (details: { callId: string; state: CallState }) => void
}

type State = {
  callId: string | null
}

type Actions = {
  removePending: () => void

  /** Every `listen` call replaces the previous listener. */
  listen: (
    handler: (payload: CallManagerIncomingCallPayload) => void
  ) => () => void
}

export type PendingIncomingCallStoreState = State & Actions
export type PendingIncomingCallStore = StoreApi<PendingIncomingCallStoreState>

export const createPendingIncomingCallStore = (
  params: PendingIncomingCallStoreParams
): StoreWithLifecycle<PendingIncomingCallStore> => {
  const { callManager, isActiveSessionExists, onWrongCallState } = params

  let terminalStateAc: AbortController | null = null
  let sdkAc: AbortController | null = null
  let incomingCallHandler:
    | ((payload: CallManagerIncomingCallPayload) => void)
    | null = null

  const stopTerminalStateWatch = () => {
    terminalStateAc?.abort()
    terminalStateAc = null
  }

  const stopSdkSubscription = () => {
    sdkAc?.abort()
    sdkAc = null
  }

  const store = createStore<PendingIncomingCallStoreState>()(
    immer((set, get) => {
      const removePending = () => {
        stopTerminalStateWatch()
        set((s) => {
          s.callId = null
        })
      }

      const prepareIncomingCall = (
        event: OnIncomingCallEvent
      ): CallManagerIncomingCallPayload | null => {
        const { call, withVideo, headers } = event
        const callId = call.id

        if (get().callId || isActiveSessionExists()) {
          call.reject(RejectMode.Busy)
          return null
        }

        if (call.state.value !== CallState.Created) {
          logger.error('PENDING_INCOMING_CALL', 'Wrong call state', {
            callId,
            state: call.state.value
          })
          onWrongCallState({ callId, state: call.state.value })
          return null
        }

        stopTerminalStateWatch()
        terminalStateAc = new AbortController()

        call.state.watch(removePending, {
          immediate: true,
          guard: isTerminalCallState,
          signal: terminalStateAc.signal
        })

        set((s) => {
          s.callId = callId
        })

        return { callId, withVideo, headers }
      }

      return {
        callId: null,
        removePending,

        listen: (handler) => {
          stopSdkSubscription()
          incomingCallHandler = handler

          sdkAc = new AbortController()
          callManager.subscribeToIncomingCall(
            (event) => {
              const prepared = prepareIncomingCall(event)
              if (prepared) incomingCallHandler?.(prepared)
            },
            { signal: sdkAc.signal }
          )

          return () => {
            if (incomingCallHandler !== handler) return

            stopSdkSubscription()
            incomingCallHandler = null
          }
        }
      }
    })
  )

  return attachLifecycle(store, {
    destroy: () => {
      stopTerminalStateWatch()
      stopSdkSubscription()
      incomingCallHandler = null
    }
  })
}
