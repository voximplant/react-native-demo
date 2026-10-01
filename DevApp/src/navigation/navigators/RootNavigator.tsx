import { MainProvider } from '@/providers'
import { AuthStatus, useAuth } from '@/providers/auth'
import { AuthNavigator } from './auth'
import { MainNavigator } from './main'

export const RootNavigator = () => {
  const isAuthenticated = useAuth((s) => s.status === AuthStatus.AUTHENTICATED)

  return isAuthenticated ? (
    <MainProvider>
      <MainNavigator />
    </MainProvider>
  ) : (
    <AuthNavigator />
  )
}
