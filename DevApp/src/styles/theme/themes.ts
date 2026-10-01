import {
  OPACITY,
  SHADOWS,
  SHAPE,
  SIZES,
  SPACING,
  TYPOGRAPHY
} from './constants'
import { DARK_THEME_COLORS, LIGHT_THEME_COLORS } from './constants/colors'
import type { Theme } from './theme.types'

export const LIGHT_THEME: Theme = {
  dark: false,
  colors: LIGHT_THEME_COLORS,
  shadows: SHADOWS,
  spacing: SPACING,
  shape: SHAPE,
  typography: TYPOGRAPHY,
  opacity: OPACITY,
  sizes: SIZES
}

export const DARK_THEME: Theme = {
  dark: true,
  colors: DARK_THEME_COLORS,
  shadows: SHADOWS,
  spacing: SPACING,
  shape: SHAPE,
  typography: TYPOGRAPHY,
  opacity: OPACITY,
  sizes: SIZES
}
