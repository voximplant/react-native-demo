import { useMainNavigation, useResetMainNavigation } from '@/navigation'
import { useMedia } from '@/providers/media'
import { usePendingIncomingCall } from '@/providers/pendingIncomingCall'
import { logger } from '@/utils'
import { type CallSettings } from '@voximplant/react-native-calls'
import { useCallback } from 'react'
import { Alert } from 'react-native'
import { useIncomingCall } from '../providers'

export const useIncomingCallActions = () => {
  const navigation = useMainNavigation()
  const resetMainNavigation = useResetMainNavigation()
  const removePending = usePendingIncomingCall(s => s.removePending)
  const resolveLocalStream = useMedia((s) => s.resolveLocalStream)

  const callId = useIncomingCall((s) => s.callId)
  const withVideo = useIncomingCall((s) => s.withVideo)
  const mute = useIncomingCall((s) => s.mute)
  const answerCall = useIncomingCall((s) => s.answer)
  const declineCall = useIncomingCall((s) => s.decline)
  const busyCall = useIncomingCall((s) => s.busy)

  const answer = useCallback(
    (options: { muteAudio: boolean; receiveVideo: boolean }) => {
      const settings: CallSettings = {
        localVideoStream: withVideo
          ? (resolveLocalStream() ?? undefined)
          : undefined,
        receiveVideo: options.receiveVideo
      }

      try {
        logger.info('INCOMING_CALL', 'answering call', { settings })
        answerCall(settings)
      } catch (err) {
        logger.error('INCOMING_CALL', 'failed to answer call', { err })
        Alert.alert('Error', 'Failed to answer call')
        resetMainNavigation()
        removePending()
        return
      }

      mute(options.muteAudio)
      navigation.replace('Call', { callId })
    },
    [
      callId,
      withVideo,
      navigation,
      answerCall,
      mute,
      resetMainNavigation,
      removePending,
      resolveLocalStream
    ]
  )

  const decline = useCallback(() => {
    try {
      declineCall()
    } catch (err) {
      logger.error('INCOMING_CALL', 'failed to reject (decline) call', { err })
      removePending()
    } finally {
      resetMainNavigation()
    }
  }, [declineCall, removePending, resetMainNavigation])

  const busy = useCallback(() => {
    try {
      busyCall()
    } catch (err) {
      logger.error('INCOMING_CALL', 'failed to reject (busy) call', { err })
      removePending()
    } finally {
      resetMainNavigation()
    }
  }, [busyCall, removePending, resetMainNavigation])

  return { answer, decline, busy }
}
