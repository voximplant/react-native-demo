import { createContext, useState, type PropsWithChildren } from 'react'
import {
  createActiveSessionStore,
  type ActiveSessionStore
} from './activeSession.store'

type ActiveSessionCtx = ActiveSessionStore

export const ActiveSessionContext = createContext<ActiveSessionCtx | null>(null)

export const ActiveSessionProvider: React.FC<PropsWithChildren> = ({
  children
}) => {
  const [store] = useState(createActiveSessionStore)

  return (
    <ActiveSessionContext.Provider value={store}>
      {children}
    </ActiveSessionContext.Provider>
  )
}
