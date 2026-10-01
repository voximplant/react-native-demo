import { DARK_THEME, LIGHT_THEME } from './themes'
import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native'

export const NAVIGATION_LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: LIGHT_THEME.colors.background,
    card: LIGHT_THEME.colors.surface,
    text: LIGHT_THEME.colors.text,
    border: LIGHT_THEME.colors.border,
    primary: LIGHT_THEME.colors.accent,
  }
}

export const NAVIGATION_DARK_THEME: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: DARK_THEME.colors.background,
    card: DARK_THEME.colors.surface,
    text: DARK_THEME.colors.text,
    border: DARK_THEME.colors.border,
    primary: DARK_THEME.colors.accent
  }
}
