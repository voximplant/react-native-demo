import type { ViewStyle } from 'react-native'
import type { LineHeightVariant } from './constants'

export interface ThemeColors {
  background: string
  surface: string
  canvas: string
  labelText: string
  captionText: string
  text: string
  placeholder: string
  textSecondary: string
  textTertiary: string
  textAccent: string
  textOnAccent: string
  textDisabled: string
  accent: string
  accentSecondary: string
  accentAlternative: string
  border: string
  error: string
  icon: string
  backdrop: string
}

export interface ThemeShadows {
  sm: ViewStyle
  md: ViewStyle
  lg: ViewStyle
  bottomSheet: ViewStyle
}

export interface ThemeSpacing {
  xs: 4
  s: 8
  m: 16
  l: 24
  xl: 32
  xxl: 40
  content: number
  labelGap: number
  inputPaddingV: number
  inputPaddingH: number
}

export interface ThemeShape {
  borderRadius: {
    s: 4
    m: 8
    l: 12
    xl: 16
  }
}

export interface ThemeTypography {
  xs: 10
  s: 12
  m: 14
  l: 16
  xl: 20
  xxl: 24
  lineHeight: (fontSize: number, variant?: LineHeightVariant) => number
}

export interface ThemeOpacity {
  pressed: number
  disabled: number
}

export type SizeVariant = 'sm' | 'md' | 'lg'

export interface ThemeSizeVariants extends Record<SizeVariant, number> {}

export interface ThemeSizes {
  actionBar: ThemeSizeVariants
  actionBarIcon: ThemeSizeVariants
  fab: ThemeSizeVariants
  fabIcon: ThemeSizeVariants
}

export interface Theme {
  dark: boolean
  colors: ThemeColors
  shadows: ThemeShadows
  spacing: ThemeSpacing
  shape: ThemeShape
  typography: ThemeTypography
  opacity: ThemeOpacity
  sizes: ThemeSizes
}
