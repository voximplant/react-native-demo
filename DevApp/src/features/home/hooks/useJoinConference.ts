import { useMainNavigation } from '@/navigation'
import { useMedia } from '@/providers/media'
import { sdkService } from '@/services/sdk'
import { logger } from '@/utils'
import type { UseFormSetError } from 'react-hook-form'
import { Alert } from 'react-native'
import type { JoinFormData } from './useJoinForm/joinForm.schema'

type Props = {
  setError?: UseFormSetError<JoinFormData>
}

export const useJoinConference = ({ setError: setError }: Props) => {
  const navigation = useMainNavigation()
  const resolveLocalStream = useMedia((s) => s.resolveLocalStream)

  const join = (data: JoinFormData) => {
    if (data.mode !== 'conference') return

    const localVideoStream = data.sendVideo ? resolveLocalStream() : undefined

    const conference = sdkService.callManager.createConference(
      data.conferenceDestination,
      {
        localVideoStream: localVideoStream ?? undefined
      }
    )

    if (conference === null) {
      logger.error('HOME', 'failed to create conference', {
        conferenceDestination: data.conferenceDestination
      })
      setError?.('root', { message: 'Failed to create conference' })
      Alert.alert('Error', 'Failed to create conference')
      return
    }

    conference.join()
    conference.mute(data.muteAudio)
    navigation.replace('Conference', { conferenceId: conference.id })
  }

  return { join }
}
