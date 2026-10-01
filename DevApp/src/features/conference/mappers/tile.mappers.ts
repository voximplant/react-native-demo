import type { LocalTileData, RemoteTileData } from '@/shared/ui'
import type { Endpoint } from '@voximplant/react-native-calls'

export const endpointToTile = (endpoint: Endpoint): RemoteTileData => ({
  id: endpoint.id,
  isLocal: false,
  displayName: endpoint.displayName || null,
  videoStreamId: endpoint.videoStreams.value[0]?.id ?? null,
  isVad: endpoint.isVoiceActivityDetected.value,
  isMuted: endpoint.isMuted.value,
  isReceivingVideo: true
})

export const localStreamToTile = (
  streamId: string | null,
  initial: Partial<LocalTileData> = {}
): LocalTileData => ({
  id: 'local',
  isLocal: true,
  displayName: initial.displayName ?? null,
  videoStreamId: streamId,
  isMuted: initial.isMuted ?? false,
  isVad: initial.isVad ?? false
})
