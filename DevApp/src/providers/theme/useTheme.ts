import { DARK_THEME, LIGHT_THEME, type Theme } from '@/styles/theme'
import { useStore } from 'zustand'
import { useStrictContext } from '../utils/useStrictContext'
import type { ThemeStore, ThemeStoreState } from './theme.store'
import { ThemeContext } from './ThemeProvider'

export const useThemeStore = (): ThemeStore =>
  useStrictContext(ThemeContext, 'useThemeStore')

export const useTheme = <T>(selector: (state: ThemeStoreState) => T): T => {
  const store = useStrictContext(ThemeContext, 'useTheme')

  return useStore(store, selector)
}

export const themeTokensSelector = (s: ThemeStoreState): Theme =>
  s.isDark ? DARK_THEME : LIGHT_THEME

export const useThemeTokens = () => useTheme(themeTokensSelector)
