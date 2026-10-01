import { useThemeTokens } from '@/providers/theme'
import {
  ACTION_BAR_SIZES,
  SHAPE,
  SPACING,
  type SizeVariant
} from '@/styles/theme'
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native'

type Props = {
  children: React.ReactNode
  size?: SizeVariant
  style?: StyleProp<ViewStyle>
}

export const Toolbar: React.FC<Props> = ({ children, size = 'md', style }) => {
  const theme = useThemeTokens()

  return (
    <View
      style={[
        styles.container,
        {
          height: ACTION_BAR_SIZES[size],
          backgroundColor: theme.colors.surface
        },
        theme.shadows.md,
        style
      ]}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.s,
    borderRadius: SHAPE.borderRadius.xl,
    gap: SPACING.m
  }
})
