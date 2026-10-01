import { useStoreHydrated } from '@/shared/hooks/useStoreHydrated'
import { AuthStatus, useAuth, useAuthStore } from '../auth'
import { useThemeStore } from '../theme'

export const useRootProvidersReady = (): boolean => {
  const hydrated = useStoreHydrated([useAuthStore(), useThemeStore()])
  const authReady = useAuth(
    (s) => ![AuthStatus.HYDRATING, AuthStatus.RESTORING].includes(s.status)
  )

  return hydrated && authReady
}
