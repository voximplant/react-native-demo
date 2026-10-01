import { useMedia } from '@/providers/media'
import { VideoView } from '@/shared/components'
import type { ViewProps } from 'react-native'

export const LocalPreviewVideo: React.FC<ViewProps> = ({ style, ...props }) => {
  const localVideoStreamId = useMedia((s) => s.localVideoStreamId)

  return (
    <VideoView
      style={style}
      streamId={localVideoStreamId ?? undefined}
      showScaleToggle
      {...props}
    />
  )
}
