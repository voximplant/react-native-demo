import type { ThemeSizeVariants, ThemeSizes } from '../theme.types'

export const ACTION_BAR_SIZES: ThemeSizeVariants = {
  sm: 56,
  md: 64,
  lg: 72
}

export const ACTION_BAR_ICON_SIZES: ThemeSizeVariants = {
  sm: 20,
  md: 24,
  lg: 28
}

export const FAB_SIZES: ThemeSizeVariants = ACTION_BAR_SIZES
export const FAB_ICON_SIZES: ThemeSizeVariants = ACTION_BAR_ICON_SIZES

export const SIZES: ThemeSizes = {
  actionBar: ACTION_BAR_SIZES,
  actionBarIcon: ACTION_BAR_ICON_SIZES,
  fab: FAB_SIZES,
  fabIcon: FAB_ICON_SIZES
}
