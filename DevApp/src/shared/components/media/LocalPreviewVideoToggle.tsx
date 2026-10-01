import { useMedia } from '@/providers/media'
import { Button } from '@/shared/ui'

export const LocalPreviewVideoToggle = () => {
  const localVideoStreamId = useMedia((s) => s.localVideoStreamId)
  const startLocalVideo = useMedia((s) => s.startLocalVideo)
  const stopLocalVideo = useMedia((s) => s.stopLocalVideo)

  return (
    <Button
      label={localVideoStreamId ? 'Hide preview' : 'Show preview'}
      variant='secondary'
      onPress={localVideoStreamId ? stopLocalVideo : startLocalVideo}
    />
  )
}
