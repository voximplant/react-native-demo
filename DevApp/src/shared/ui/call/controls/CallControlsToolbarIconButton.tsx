import { useThemeTokens } from '@/providers/theme'
import { IconButton, ToolbarItem, type IconName } from '@/shared/ui'
import { ACTION_BAR_ICON_SIZES } from '@/styles/theme'
import { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'

type Props = {
  name: IconName
  active?: boolean
  onPress: () => void
}

const DURATION_MS = 160

export const CallControlsToolbarIconButton: React.FC<Props> = ({
  name,
  active = false,
  onPress
}) => {
  const theme = useThemeTokens()
  const activeProgress = useSharedValue(active ? 1 : 0)

  useEffect(() => {
    activeProgress.value = withTiming(active ? 1 : 0, { duration: DURATION_MS })
  }, [active, activeProgress])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 0.88 + 0.12 * activeProgress.value
  }))

  return (
    <ToolbarItem>
      <Animated.View style={[styles.container, animatedStyle]}>
        <IconButton
          name={name}
          variant={active ? 'filled' : 'standard'}
          color={active ? theme.colors.accent : theme.colors.icon}
          size={ACTION_BAR_ICON_SIZES['sm']}
          onPress={onPress}
          style={styles.iconButton}
        />
      </Animated.View>
    </ToolbarItem>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  iconButton: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    flex: 1,
    aspectRatio: 1
  }
})
