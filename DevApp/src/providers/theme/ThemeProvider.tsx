import { createContext, useState, type PropsWithChildren } from 'react'
import { createThemeStore, type ThemeStore } from './theme.store'

type ThemeCtx = ThemeStore

export const ThemeContext = createContext<ThemeCtx | null>(null)

export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [store] = useState(() => createThemeStore())

  return <ThemeContext.Provider value={store}>{children}</ThemeContext.Provider>
}
