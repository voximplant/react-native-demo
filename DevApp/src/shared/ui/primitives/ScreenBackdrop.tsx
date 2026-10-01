import { useThemeTokens } from '@/providers/theme'
import type { PropsWithChildren } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

type Props = PropsWithChildren<{
  onPress: () => void
}>

export const ScreenBackdrop: React.FC<Props> = ({ children, onPress }) => {
  const theme = useThemeTokens()

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: theme.colors.backdrop }
      ]}
    >
      <Pressable style={StyleSheet.absoluteFill} onPress={onPress} />
      {children}
    </View>
  )
}
