import { useThemeTokens } from '@/providers/theme'
import { memo, useCallback } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  type GestureResponderEvent
} from 'react-native'
import { Text } from '../Text'
import type { ButtonProps } from './button.types'
import { useButtonStyles } from './useButtonStyles'

const ButtonComponent: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  onPress,
  processing,
  style,
  labelStyle,
  ...props
}) => {
  const variantStyles = useButtonStyles(variant, size)
  const theme = useThemeTokens()

  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      if (processing) return

      onPress?.(event)
    },
    [onPress, processing]
  )

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variantStyles.button,
        props.disabled && {
          opacity: theme.opacity.disabled
        },
        style
      ]}
      {...props}
      onPress={handlePress}
    >
      <Text style={[styles.label, variantStyles.label, labelStyle]}>
        {label}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: { alignItems: 'center' },
  label: { fontWeight: '500' }
})

export const Button = memo(ButtonComponent)
