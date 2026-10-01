import { ActivityIndicator, Text } from '@/shared/ui'
import { SPACING } from '@/styles/theme'
import { StyleSheet, View } from 'react-native'

export const CallConnecting = () => (
  <View style={styles.container}>
    <ActivityIndicator size='large' />
    <Text variant='body'>Connecting...</Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.m
  }
})
