import type { ThemeTypography } from '../theme.types'

export type LineHeightVariant = 's' | 'm' | 'l' | 'xl'

const lineHeightAddition: Record<LineHeightVariant, number> = {
  s: 2,
  m: 4,
  l: 6,
  xl: 8
} as const

export const TYPOGRAPHY: ThemeTypography = {
  xs: 10,
  s: 12,
  m: 14,
  l: 16,
  xl: 20,
  xxl: 24,

  lineHeight: (fontSize: number, variant: LineHeightVariant = 'm') => {
    return fontSize + lineHeightAddition[variant]
  }
}
