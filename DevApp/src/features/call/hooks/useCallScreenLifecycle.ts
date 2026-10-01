import {
  useMainNavigation,
  usePreventBackNavigation,
  useResetMainNavigation
} from '@/navigation'
import { sdkService } from '@/services/sdk'
import { logger } from '@/utils'
import { CallState } from '@voximplant/react-native-calls'
import { useEffect } from 'react'
import { Alert } from 'react-native'
import { useCall } from '../providers'

const CALL_ENDED_STATES = [
  CallState.Disconnecting,
  CallState.Disconnected,
  CallState.Failed
]

export const useCallScreenLifecycle = () => {
  usePreventBackNavigation()
  const navigation = useMainNavigation()
  const resetMainNavigation = useResetMainNavigation()

  const callId = useCall((s) => s.callId)
  const hangup = useCall((s) => s.hangup)

  useEffect(() => {
    const call = sdkService.callManager.getCall(callId)
    if (!call) return

    const unwatch = call.state.watch(
      (state) => {
        logger.info('CALL', 'call ended', { callId: call.id, state })

        if (state === CallState.Failed) {
          Alert.alert('Call failed')
        }

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

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      const call = sdkService.callManager.getCall(callId)
      if (!call) return

      if (!CALL_ENDED_STATES.includes(call.state.value)) {
        hangup()
      }
    })

    return unsubscribe
  }, [navigation, hangup, callId])
}
