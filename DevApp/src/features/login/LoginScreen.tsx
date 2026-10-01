import { en } from '@/constants'
import { KeyboardAwareScroll } from '@/shared/components'
import { Text } from '@/shared/ui'
import { SPACING } from '@/styles/theme'
import { StyleSheet } from 'react-native'
import { LoginForm } from './components/LoginForm'

export function LoginScreen() {
  return (
    <KeyboardAwareScroll contentContainerStyle={styles.contentContainer}>
      <Text variant='display' style={styles.title}>
        {en.app.name}
      </Text>
      <LoginForm />
    </KeyboardAwareScroll>
  )
}

const styles = StyleSheet.create({
  contentContainer: { flexGrow: 1, justifyContent: 'center' },
  title: {
    marginBottom: SPACING.l,
    textAlign: 'center'
  }
})
