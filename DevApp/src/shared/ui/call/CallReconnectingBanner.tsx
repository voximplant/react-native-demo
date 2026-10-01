import { useThemeTokens } from '@/providers/theme'
import { ActivityIndicator, Text } from '@/shared/ui'
import { SHAPE, SPACING } from '@/styles/theme'
import { StyleSheet, View } from 'react-native'

export const CallReconnectingBanner = () => {
  const theme = useThemeTokens()

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <ActivityIndicator size='small' />
      <Text variant='body'>Reconnecting...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
    padding: SPACING.m,
    marginBottom: SPACING.s,
    borderRadius: SHAPE.borderRadius.m
  }
})
