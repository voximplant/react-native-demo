import { useMedia } from '@/providers/media'
import {
  CallControlsBar,
  CallControlsHangupFAB,
  CallControlsToolbar
} from '@/shared/ui'
import { type StyleProp, type ViewStyle } from 'react-native'
import { useConference } from '../../providers'

type Props = {
  style?: StyleProp<ViewStyle>
}

export const ConferenceControls: React.FC<Props> = ({ style }) => {
  const resolveLocalStream = useMedia((s) => s.resolveLocalStream)
  const isMuted = useConference((s) => s.isMuted)
  const mute = useConference((s) => s.mute)
  const isSendingVideo = useConference((s) => s.isSendingVideo)
  const hangup = useConference((s) => s.hangup)
  const startSendingVideo = useConference((s) => s.startSendingVideo)
  const stopSendingVideo = useConference((s) => s.stopSendingVideo)

  const handleSendVideo = (value: boolean) => {
    if (!value) {
      stopSendingVideo()
      return
    }

    const stream = resolveLocalStream()
    if (stream) startSendingVideo(stream)
  }

  return (
    <CallControlsBar style={style}>
      <CallControlsToolbar
        isMuted={isMuted}
        onMuteChange={mute}
        isSendingVideo={isSendingVideo}
        onSendVideoChange={handleSendVideo}
      />

      <CallControlsHangupFAB onPress={hangup} />
    </CallControlsBar>
  )
}
