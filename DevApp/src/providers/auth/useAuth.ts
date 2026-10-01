import { useStore } from 'zustand'
import { useStrictContext } from '../utils/useStrictContext'
import type { AuthStore, AuthStoreState } from './auth.store'
import { AuthContext } from './AuthProvider'

export const useAuthStore = (): AuthStore =>
  useStrictContext(AuthContext, 'useAuthStore')

export const useAuth = <T>(selector: (state: AuthStoreState) => T): T => {
  const store = useStrictContext(AuthContext, 'useAuth')

  return useStore(store, selector)
}
