import { useThemeTokens } from '@/providers/theme'
import { SHAPE, SPACING } from '@/styles/theme'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Icon } from '../Icon'
import { getIconColor, getVariantStyle } from './iconButton.styles'
import type { IconButtonProps } from './iconButton.types'

export const IconButton: React.FC<IconButtonProps> = ({
  name,
  size = 28,
  color,
  variant = 'standard',
  style,
  ...props
}) => {
  const theme = useThemeTokens()

  return (
    <TouchableOpacity
      style={[styles.button, getVariantStyle(variant, theme, color), style]}
      {...props}
    >
      <Icon
        name={name}
        size={size}
        color={getIconColor(variant, theme, color)}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: SHAPE.borderRadius.l,
    justifyContent: 'center',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.m
  }
})
