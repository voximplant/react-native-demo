import { useThemeTokens } from '@/providers/theme'
import { ActivityIndicator } from '../ui/primitives/ActivityIndicator'

export const ActivityIndicatorView = () => {
  const theme = useThemeTokens()

  return (
    <ActivityIndicator
      size='large'
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    />
  )
}
