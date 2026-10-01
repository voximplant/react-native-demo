import { useThemeTokens } from '@/providers/theme'
import { VideoView } from '@/shared/components'
import { SHAPE } from '@/styles/theme'
import { VideoRenderScaleType } from '@voximplant/react-native-calls'
import { memo } from 'react'
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native'
import { TileLabel } from '../TileLabel'
import type { TileData } from './tile.types'

type Props = {
  data: TileData
  style?: StyleProp<ViewStyle>
  showLabel?: boolean
}

export const Tile: React.FC<Props> = memo(
  ({ data, style, showLabel = true }) => {
    const theme = useThemeTokens()
    const label = data.isLocal ? 'Local' : (data.displayName ?? data.id)
    const showVideo = data.isLocal || data.isReceivingVideo

    const defaultScaleType = data.isLocal
      ? VideoRenderScaleType.Fit
      : VideoRenderScaleType.Fill

    return (
      <View style={[styles.tile, style]}>
        <VideoView
          style={styles.video}
          streamId={showVideo ? data.videoStreamId : null}
          defaultScaleType={defaultScaleType}
          showScaleToggle={data.isLocal}
          borderColor={data.isVad ? theme.colors.accentAlternative : undefined}
        />

        {showLabel ? (
          <TileLabel
            label={label}
            isMuted={data.isMuted}
            isVideoStopped={!data.isLocal && !data.isReceivingVideo}
          />
        ) : null}
      </View>
    )
  }
)

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: SHAPE.borderRadius.xl
  },
  video: { flex: 1 }
})
