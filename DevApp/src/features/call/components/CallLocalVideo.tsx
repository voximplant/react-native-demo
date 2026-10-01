import { VideoView } from '@/shared/components'
import type { VideoRenderScaleType } from '@voximplant/react-native-calls'
import type { ViewProps } from 'react-native'
import { useCall } from '../providers'

type Props = ViewProps & {
  scaleType?: VideoRenderScaleType
}

export const CallLocalVideo: React.FC<Props> = ({ scaleType, ...props }) => {
  const localVideoStreamId = useCall((s) => s.localVideoStreamId)

  return (
    <VideoView
      streamId={localVideoStreamId ?? undefined}
      showScaleToggle
      {...props}
    />
  )
}
