import { useMedia } from '@/providers/media'
import {
  CallControlsBar,
  CallControlsHangupFAB,
  CallControlsToolbar
} from '@/shared/ui'
import { type StyleProp, type ViewStyle } from 'react-native'
import { useCall } from '../../providers'

type Props = {
  style?: StyleProp<ViewStyle>
}

export const CallControls: React.FC<Props> = ({ style }) => {
  const resolveLocalStream = useMedia((s) => s.resolveLocalStream)

  const isMuted = useCall((s) => s.isMuted)
  const isOnHold = useCall((s) => s.isOnHold)
  const isSendingVideo = useCall((s) => s.isSendingVideo)
  const hangup = useCall((s) => s.hangup)
  const mute = useCall((s) => s.mute)
  const hold = useCall((s) => s.hold)
  const startSendingVideo = useCall((s) => s.startSendingVideo)
  const stopSendingVideo = useCall((s) => s.stopSendingVideo)

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
        isOnHold={isOnHold}
        onHoldChange={hold}
      />

      <CallControlsHangupFAB onPress={hangup} />
    </CallControlsBar>
  )
}
