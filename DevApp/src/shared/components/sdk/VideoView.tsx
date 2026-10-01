import { useThemeTokens } from '@/providers/theme'
import { useAnimatedValue } from '@/shared/hooks'
import { IconButton, type IconName } from '@/shared/ui'
import { SHAPE, SPACING } from '@/styles/theme'
import {
  VideoView as SDKVideoView,
  VideoRenderScaleType
} from '@voximplant/react-native-calls'
import { useState } from 'react'
import { StyleSheet, View, type ViewProps } from 'react-native'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'

const SCALE_TYPE_ICON: Record<VideoRenderScaleType, IconName> = {
  [VideoRenderScaleType.Fit]: 'maximize2',
  [VideoRenderScaleType.Fill]: 'minimize2'
}

type Props = ViewProps & {
  streamId: string | null | undefined
  defaultScaleType?: VideoRenderScaleType
  showScaleToggle?: boolean
  borderColor?: string
}

export const VideoView: React.FC<Props> = ({
  style,
  streamId,
  defaultScaleType = VideoRenderScaleType.Fit,
  showScaleToggle = false,
  borderColor,
  ...props
}) => {
  const theme = useThemeTokens()
  const [scaleType, setScaleType] = useState(defaultScaleType)

  const animatedBorderColor = useAnimatedValue(
    borderColor ?? theme.colors.border
  )
  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderColor: animatedBorderColor.value
  }))

  const toggleScaleType = () =>
    setScaleType((current) =>
      current === VideoRenderScaleType.Fit
        ? VideoRenderScaleType.Fill
        : VideoRenderScaleType.Fit
    )

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.canvas
        },
        style,
        animatedBorderStyle
      ]}
      {...props}
    >
      {streamId ? (
        <SDKVideoView
          style={styles.video}
          streamId={streamId}
          scaleType={scaleType}
        />
      ) : (
        <View style={styles.video} />
      )}

      {showScaleToggle && streamId && (
        <IconButton
          name={SCALE_TYPE_ICON[scaleType]}
          style={styles.toggle}
          onPress={toggleScaleType}
        />
      )}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: SHAPE.borderRadius.xl,
    borderWidth: 2,
    overflow: 'hidden'
  },
  video: { flex: 1 },
  toggle: {
    position: 'absolute',
    bottom: SPACING.s,
    right: SPACING.s
  }
})
