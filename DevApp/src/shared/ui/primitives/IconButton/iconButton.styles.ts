import type { Theme } from '@/styles/theme'
import { StyleSheet } from 'react-native'
import type { IconButtonVariant } from './iconButton.types'

const VARIANT_STYLE: Record<
  IconButtonVariant,
  (theme: Theme, color?: string) => object
> = {
  standard: () => ({}),
  filled: (theme, color) => ({
    backgroundColor: color ?? theme.colors.accent
  }),
  tonal: (theme) => ({
    backgroundColor: theme.colors.canvas
  }),
  outlined: (theme, color) => ({
    backgroundColor: 'transparent',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: color ?? theme.colors.border
  })
}

export const getVariantStyle = (
  variant: IconButtonVariant,
  theme: Theme,
  color?: string
) => VARIANT_STYLE[variant](theme, color)

const VARIANT_ICON_COLOR: Record<
  IconButtonVariant,
  (theme: Theme, color?: string) => string
> = {
  standard: (theme, color) => color ?? theme.colors.icon,
  filled: (theme) => theme.colors.textOnAccent,
  tonal: (theme, color) => color ?? theme.colors.icon,
  outlined: (theme, color) => color ?? theme.colors.icon
}

export const getIconColor = (
  variant: IconButtonVariant,
  theme: Theme,
  color?: string
) => VARIANT_ICON_COLOR[variant](theme, color)
