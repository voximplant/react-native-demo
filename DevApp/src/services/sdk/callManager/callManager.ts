import { logger } from '@/utils'
import {
  CallManager,
  CallManagerEvent,
  type Call,
  type CallId,
  type CallManagerIncomingCall,
  type CallSettings,
  type Conference,
  type ConferenceId,
  type ConferenceSettings
} from '@voximplant/react-native-calls'
import type { OnIncomingCallEvent } from './callManager.types'

export class CallManagerService {
  private readonly cm: CallManager = CallManager.getInstance()

  private static _instance: CallManagerService | null = null

  static get instance(): CallManagerService {
    if (!this._instance) this._instance = new CallManagerService()
    return this._instance
  }

  static init(): CallManagerService {
    return this.instance
  }

  get calls(): Map<CallId, Call> {
    return this.cm.calls
  }

  getCall(callId: string): Call | null {
    return this.cm.calls.get(callId) ?? null
  }

  createCall(destination: string, settings?: CallSettings): Call | null {
    return this.cm.createCall(destination, settings)
  }

  get conferences(): Map<ConferenceId, Conference> {
    return this.cm.conferences
  }

  getConference(conferenceId: ConferenceId): Conference | null {
    return this.cm.conferences.get(conferenceId) ?? null
  }

  createConference(
    conferenceName: string,
    settings?: ConferenceSettings
  ): Conference | null {
    return this.cm.createConference(conferenceName, settings)
  }

  subscribeToIncomingCall(
    onIncomingCall: (event: OnIncomingCallEvent) => void,
    options?: { signal?: AbortSignal }
  ): void {
    const handler = ({ payload }: CallManagerIncomingCall) => {
      logger.info('ON_INCOMING_CALL', 'incoming call', {
        callId: payload.callId,
        withVideo: payload.withVideo,
        headers: payload.headers
      })

      const call = this.getCall(payload.callId)
      if (!call) {
        logger.error('ON_INCOMING_CALL', 'call not found', {
          callId: payload.callId
        })
        return
      }

      onIncomingCall({
        call,
        withVideo: payload.withVideo,
        headers: payload.headers
      })
    }

    this.cm.addEventListener(CallManagerEvent.IncomingCall, handler, {
      signal: options?.signal
    })
  }
}
