import { useStrictContext } from '../utils/useStrictContext'
import { useStore } from 'zustand'
import type { SettingsStoreState } from './settings.store'
import { SettingsContext } from './SettingsProvider'

export const useSettingsStore = () =>
  useStrictContext(SettingsContext, 'useSettingsStore')

export const useSettings = <T>(
  selector: (state: SettingsStoreState) => T
): T => {
  const store = useStrictContext(SettingsContext, 'useSettings')

  return useStore(store, selector)
}
