import { LoginScreen } from '@/features/login'
import { AuthLayout } from '@/layouts'
import type { AuthStackParamList } from '@/navigation'
import { useThemeTokens } from '@/providers/theme'
import { ThemeToggle } from '@/shared/components'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const AuthStack = createNativeStackNavigator<AuthStackParamList>()

export const AuthNavigator = () => {
  const theme = useThemeTokens()

  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitle: '',
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: theme.colors.background
        },
        headerTintColor: theme.colors.text,
        headerRight: () => <ThemeToggle />
      }}
    >
      <AuthStack.Screen
        name='Login'
        component={LoginScreen}
        layout={({ children }) => <AuthLayout>{children}</AuthLayout>}
      />
    </AuthStack.Navigator>
  )
}
