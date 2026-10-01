import { useSettingsStore } from '@/providers/settings'
import { ActivityIndicatorView } from '@/shared/components'
import { useStoreHydrated } from '@/shared/hooks/useStoreHydrated'
import type { PropsWithChildren } from 'react'

export const SettingsLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const hydrated = useStoreHydrated(useSettingsStore())

  if (!hydrated) return <ActivityIndicatorView />

  return children
}
