import { useThemeTokens } from '@/providers/theme'
import {
  FAB_ICON_SIZES,
  FAB_SIZES,
  SHAPE,
  SPACING,
  type SizeVariant
} from '@/styles/theme'
import { Pressable, StyleSheet, View, type PressableProps } from 'react-native'
import { Icon, type IconName } from '../Icon'
import { Text } from '../Text'

type Props = PressableProps & {
  icon: IconName
  size?: SizeVariant
  label?: string
}

export const FAB: React.FC<Props> = ({
  icon,
  size = 'md',
  style,
  label,
  ...props
}) => {
  const theme = useThemeTokens()
  const dimension = FAB_SIZES[size]

  return (
    <Pressable
      style={({ pressed }) => [
        styles.fab,
        theme.shadows.sm,
        !label && { width: dimension },
        {
          height: dimension,
          backgroundColor: theme.colors.accent,
          opacity: pressed ? theme.opacity.pressed : 1
        },
        typeof style === 'function' ? style({ pressed }) : style
      ]}
      {...props}
    >
      <View style={styles.content}>
        <Icon
          name={icon}
          size={FAB_ICON_SIZES[size]}
          color={theme.colors.textOnAccent}
        />
        {label && (
          <Text
            variant='heading_2'
            style={{ color: theme.colors.textOnAccent }}
          >
            {label}
          </Text>
        )}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  fab: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderRadius: SHAPE.borderRadius.l
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.m
  }
})
