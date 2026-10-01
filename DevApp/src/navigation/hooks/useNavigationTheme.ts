import { useTheme } from '@/providers/theme'
import { NAVIGATION_DARK_THEME, NAVIGATION_LIGHT_THEME } from '@/styles/theme'

export const useNavigationTheme = () => {
  const isDark = useTheme((s) => s.isDark)
  return isDark ? NAVIGATION_DARK_THEME : NAVIGATION_LIGHT_THEME
}
