import { sdkService } from '@/services/sdk'
import { createContext, useState, type PropsWithChildren } from 'react'
import { createAuthStore, type AuthStore } from './auth.store'
import { useRestoreAuth } from './useRestoreAuth'

type AuthCtx = AuthStore

export const AuthContext = createContext<AuthCtx | null>(null)

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [store] = useState(() => createAuthStore({ sdkService }))
  useRestoreAuth(store)

  return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>
}
