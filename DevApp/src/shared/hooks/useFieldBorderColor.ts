import { useThemeTokens } from '@/providers/theme'

export const useFieldBorderColor = (focused: boolean, error?: string) => {
  const theme = useThemeTokens()

  if (error) return theme.colors.error
  if (focused) return theme.colors.accent

  return theme.colors.border
}
