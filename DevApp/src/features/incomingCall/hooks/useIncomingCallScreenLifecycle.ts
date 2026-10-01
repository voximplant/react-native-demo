import { usePreventBackNavigation, useResetMainNavigation } from '@/navigation'
import { sdkService } from '@/services/sdk'
import { logger } from '@/utils'
import { CallState } from '@voximplant/react-native-calls'
import { useEffect } from 'react'
import { useIncomingCall } from '../providers'

const CALL_ENDED_STATES = [
  CallState.Disconnecting,
  CallState.Disconnected,
  CallState.Failed
]

export const useIncomingCallScreenLifecycle = () => {
  usePreventBackNavigation()
  const resetMainNavigation = useResetMainNavigation()

  const callId = useIncomingCall((s) => s.callId)
  
  useEffect(() => {
    const call = sdkService.callManager.getCall(callId)
    if (!call) return

    const unwatch = call.state.watch(
      (state) => {
        logger.info('INCOMING_CALL', 'incoming call ended', {
          callId: call.id,
          state
        })
        resetMainNavigation()
      },
      {
        immediate: true,
        once: true,
        guard: (state) => CALL_ENDED_STATES.includes(state)
      }
    )

    return unwatch
  }, [callId, resetMainNavigation])
}
