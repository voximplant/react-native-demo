import { useTheme, useThemeTokens } from '@/providers/theme'
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack'

export const useStackNavigatorScreenOptions =
  (): NativeStackNavigationOptions => {
    const isDark = useTheme((s) => s.isDark)
    const theme = useThemeTokens()

    return {
      headerShown: true,
      headerTitle: '',
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: theme.colors.background
      },
      headerTintColor: theme.colors.text,
      statusBarStyle: isDark ? 'light' : 'dark'
    }
  }
