import { useThemeTokens } from '@/providers/theme'
import type { SizeVariant } from '@/styles/theme'
import { BUTTON_SIZE_STYLES } from './button.styles'
import type { ButtonVariant } from './button.types'

export const useButtonStyles = (
  variant: ButtonVariant,
  size: SizeVariant = 'lg'
) => {
  const theme = useThemeTokens()

  const backgroundColors: Record<ButtonVariant, string> = {
    primary: theme.colors.accent,
    secondary: theme.colors.surface,
    flat: 'transparent',
    'flat-secondary': 'transparent'
  }

  const textColors: Record<ButtonVariant, string> = {
    primary: theme.colors.textOnAccent,
    secondary: theme.colors.text,
    flat: theme.colors.textAccent,
    'flat-secondary': theme.colors.textSecondary
  }

  const buttonSizeStyle = BUTTON_SIZE_STYLES[size]

  return {
    button: {
      backgroundColor: backgroundColors[variant],
      borderRadius: theme.shape.borderRadius.s,
      ...buttonSizeStyle.button
    },
    label: { color: textColors[variant], ...buttonSizeStyle.label }
  }
}
