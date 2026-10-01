import { useGlobalLoading } from '@/providers/globalLoading'
import { useThemeTokens } from '@/providers/theme'
import { View } from 'react-native'
import { ProgressBar } from '../ui/primitives/ProgressBar'

export const GlobalLoading = () => {
  const isLoading = useGlobalLoading((s) => s.isLoading)
  const theme = useThemeTokens()

  return (
    <View style={{ paddingHorizontal: theme.spacing.content }}>
      <ProgressBar visible={isLoading} />
    </View>
  )
}
