import { useThemeTokens } from '@/providers/theme'
import { StyleSheet, View } from 'react-native'

export const Separator = () => {
  const theme = useThemeTokens()

  return (
    <View
      style={[styles.separator, { backgroundColor: theme.colors.border }]}
    />
  )
}

const styles = StyleSheet.create({
  separator: {
    height: StyleSheet.hairlineWidth
  }
})
