import { Toolbar } from '@/shared/ui'
import { CallControlsToolbarIconButton } from './CallControlsToolbarIconButton'

type Props = {
  isMuted: boolean
  onMuteChange: (value: boolean) => void
  isSendingVideo: boolean
  onSendVideoChange: (value: boolean) => void
  isOnHold?: boolean
  onHoldChange?: (value: boolean) => void
}

export const CallControlsToolbar: React.FC<Props> = ({
  isMuted,
  onMuteChange,
  isSendingVideo,
  onSendVideoChange,
  isOnHold,
  onHoldChange
}) => (
  <Toolbar size='md'>
    <CallControlsToolbarIconButton
      name={isMuted ? 'mic-off' : 'mic'}
      active={isMuted}
      onPress={() => onMuteChange(!isMuted)}
    />

    <CallControlsToolbarIconButton
      name={isSendingVideo ? 'video' : 'video-off'}
      active={isSendingVideo}
      onPress={() => onSendVideoChange(!isSendingVideo)}
    />

    {isOnHold !== undefined && onHoldChange !== undefined ? (
      <CallControlsToolbarIconButton
        name={isOnHold ? 'play' : 'pause'}
        active={isOnHold}
        onPress={() => onHoldChange(!isOnHold)}
      />
    ) : null}
  </Toolbar>
)
