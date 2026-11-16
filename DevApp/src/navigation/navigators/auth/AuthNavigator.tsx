import { LoginScreen } from '@/features/login'
import { AuthLayout } from '@/layouts'
import {
  useStackNavigatorScreenOptions,
  type AuthStackParamList
} from '@/navigation'
import { ThemeToggle } from '@/shared/components'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const AuthStack = createNativeStackNavigator<AuthStackParamList>()

export const AuthNavigator = () => {
  const screenOptions = useStackNavigatorScreenOptions()

  return (
    <AuthStack.Navigator
      screenOptions={{
        ...screenOptions,
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
