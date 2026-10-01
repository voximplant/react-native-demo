import { createContext, useState, type PropsWithChildren } from 'react'
import {
  createGlobalLoadingStore,
  type GlobalLoadingStore
} from './globalLoading.store'

export const GlobalLoadingContext = createContext<GlobalLoadingStore | null>(
  null
)

export const GlobalLoadingProvider: React.FC<PropsWithChildren> = ({
  children
}) => {
  const [store] = useState(createGlobalLoadingStore)

  return (
    <GlobalLoadingContext.Provider value={store}>
      {children}
    </GlobalLoadingContext.Provider>
  )
}
