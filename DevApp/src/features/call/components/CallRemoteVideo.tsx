import { VideoView } from '@/shared/components'
import { StyleSheet } from 'react-native'
import { useCall } from '../providers'

export const CallRemoteVideo = () => {
  const remoteVideoStreamId = useCall((s) => s.remoteVideoStreamId)

  return (
    <VideoView
      style={styles.video}
      streamId={remoteVideoStreamId ?? undefined}
    />
  )
}

const styles = StyleSheet.create({
  video: { flex: 1 }
})
