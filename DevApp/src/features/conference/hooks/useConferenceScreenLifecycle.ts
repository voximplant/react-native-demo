import {
  useMainNavigation,
  usePreventBackNavigation,
  useResetMainNavigation
} from '@/navigation'
import { sdkService } from '@/services/sdk'
import { logger } from '@/utils'
import { ConferenceState } from '@voximplant/react-native-calls'
import { useEffect } from 'react'
import { Alert } from 'react-native'
import { useConference } from '../providers'

const CONFERENCE_ENDED_STATES = [
  ConferenceState.Disconnecting,
  ConferenceState.Disconnected,
  ConferenceState.Failed
]

export const useConferenceScreenLifecycle = () => {
  usePreventBackNavigation()
  const navigation = useMainNavigation()
  const resetMainNavigation = useResetMainNavigation()

  const conferenceId = useConference((s) => s.conferenceId)
  const hangup = useConference((s) => s.hangup)

  useEffect(() => {
    const conference = sdkService.callManager.getConference(conferenceId)
    if (!conference) return

    const unwatch = conference.state.watch(
      (state) => {
        logger.info('CONFERENCE', 'conference ended', {
          conferenceId: conference.id,
          state
        })
        if (state === ConferenceState.Failed) {
          Alert.alert('Conference failed')
        }
        resetMainNavigation()
      },
      {
        immediate: true,
        once: true,
        guard: (state) => CONFERENCE_ENDED_STATES.includes(state)
      }
    )

    return unwatch
  }, [conferenceId, resetMainNavigation])

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      const conference = sdkService.callManager.getConference(conferenceId)
      const state = conference?.state.value

      if (state && !CONFERENCE_ENDED_STATES.includes(state)) {
        hangup()
      }
    })

    return unsubscribe
  }, [navigation, hangup, conferenceId])
}
