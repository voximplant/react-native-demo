import type { PersistedStoreApi } from '@/utils'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Appearance } from 'react-native'
import { createStore } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

type State = {
  isDark: boolean
}

type Actions = {
  toggleTheme: () => void
}

export type ThemeStoreState = State & Actions
export type ThemeStore = PersistedStoreApi<ThemeStoreState, State>

export const createThemeStore = (): ThemeStore => {
  const systemIsDark = Appearance.getColorScheme() === 'dark'

  const store = createStore<ThemeStoreState>()(
    persist(
      immer((set, get) => ({
        isDark: systemIsDark,

        toggleTheme: () => {
          const next = !get().isDark

          set((state) => {
            state.isDark = next
          })

          Appearance.setColorScheme(next ? 'dark' : 'light')
        }
      })),
      {
        name: 'theme',

        storage: createJSONStorage<State>(() => AsyncStorage),

        partialize: (state): State => ({
          isDark: state.isDark
        }),

        onRehydrateStorage: () => {
          return (state, error) => {
            if (!error && state) {
              Appearance.setColorScheme(state.isDark ? 'dark' : 'light')
            }
          }
        }
      }
    )
  )

  return store
}
