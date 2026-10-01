import { useThemeTokens } from '@/providers/theme'
import { Icon, Text } from '@/shared/ui'
import { SHAPE, SPACING } from '@/styles/theme'
import { memo } from 'react'
import { StyleSheet, View } from 'react-native'

type Props = {
  label: string | null
  isMuted: boolean
  isVideoStopped: boolean
}

export const TileLabel: React.FC<Props> = memo(
  ({ label, isMuted, isVideoStopped }) => {
    const theme = useThemeTokens()

    if (!label && !isMuted && !isVideoStopped) return null

    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.backdrop }]}
      >
        {isMuted ? <Icon name='mic-off' size={16} /> : null}
        {isVideoStopped ? <Icon name='video-off' size={16} /> : null}
        {label ? (
          <Text variant='body' numberOfLines={1}>
            {label}
          </Text>
        ) : null}
      </View>
    )
  }
)

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: SPACING.s,
    bottom: SPACING.s,
    paddingHorizontal: SPACING.s,
    paddingVertical: 2,
    borderRadius: SHAPE.borderRadius.s,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs
  }
})
