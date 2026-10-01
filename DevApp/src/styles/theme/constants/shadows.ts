import type { ThemeShadows } from '../theme.types'
import { toNativeColor } from '../theme.utils'
import { COLORS } from './colors'

const DEFAULT_SHADOWS: Pick<ThemeShadows, 'sm' | 'md' | 'lg'> = {
  sm: {
    shadowColor: toNativeColor(COLORS.gray900),
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2
  },
  md: {
    shadowColor: toNativeColor(COLORS.gray900),
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 8
  },
  lg: {
    shadowColor: toNativeColor(COLORS.gray900),
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 16
  }
}

export const SHADOWS: ThemeShadows = {
  ...DEFAULT_SHADOWS,
  bottomSheet: {
    ...DEFAULT_SHADOWS.md,
    shadowOffset: { width: 0, height: -4 }
  }
}
