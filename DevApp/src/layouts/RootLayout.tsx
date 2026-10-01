import { useNavigationTheme } from '@/navigation'
import { useRootProvidersReady } from '@/providers/hooks'
import { useThemeTokens } from '@/providers/theme'
import { ActivityIndicatorView, StatusBar } from '@/shared/components'
import { NavigationContainer } from '@react-navigation/native'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export const RootLayout: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const isReady = useRootProvidersReady()

  const theme = useThemeTokens()
  const navigationTheme = useNavigationTheme()

  if (!isReady) return <ActivityIndicatorView />

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar />

      <SafeAreaView
        edges={['left', 'right', 'bottom']}
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        {children}
      </SafeAreaView>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
