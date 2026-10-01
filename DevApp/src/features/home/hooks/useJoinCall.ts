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

export const useJoinCall = ({ setError }: Props) => {
  const navigation = useMainNavigation()
  const resolveLocalStream = useMedia(s => s.resolveLocalStream)

  const join = (data: JoinFormData) => {
    if (data.mode !== 'call') return

    const localVideoStream = data.sendVideo ? resolveLocalStream() : undefined

    const call = sdkService.callManager.createCall(data.callDestination, {
      receiveVideo: data.receiveVideo,
      localVideoStream: localVideoStream ?? undefined
    })

    if (call === null) {
      logger.error('HOME', 'failed to create call', {
        callDestination: data.callDestination
      })
      setError?.('root', { message: 'Failed to create call' })
      Alert.alert('Error', 'Failed to create call')
      return
    }

    call.start()
    call.mute(data.muteAudio)
    navigation.replace('Call', { callId: call.id })
  }

  return { join }
}
