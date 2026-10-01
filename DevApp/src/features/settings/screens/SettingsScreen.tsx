import { useMainNavigation } from '@/navigation'
import { useThemeTokens } from '@/providers/theme'
import { Button, Content, Text } from '@/shared/ui'
import { SPACING } from '@/styles/theme'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SettingsList } from '../components'

export const SettingsScreen = () => {
  const theme = useThemeTokens()
  const navigation = useMainNavigation()

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Content>
        <View style={styles.header}>
          <Text variant='display'>Settings</Text>
          <Button
            size='sm'
            label='Close'
            variant='flat-secondary'
            onPress={navigation.goBack}
            style={styles.closeButton}
          />
        </View>

        <SettingsList />
      </Content>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.s
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s
  },
  closeButton: { width: 80 }
})
