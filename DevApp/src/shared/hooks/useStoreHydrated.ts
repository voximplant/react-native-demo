import type { AnyPersistedStore } from '@/utils'
import { useCallback, useSyncExternalStore } from 'react'

type UseStoresHydratedInput = AnyPersistedStore | AnyPersistedStore[]

export function useStoreHydrated(input: UseStoresHydratedInput): boolean {
  const stores = Array.isArray(input) ? input : [input]

  const subscribe = useCallback(
    (onChange: () => void) => {
      const unsubscribers = stores.flatMap((store) => [
        store.persist.onHydrate(onChange),
        store.persist.onFinishHydration(onChange)
      ])

      return () => {
        unsubscribers.forEach((unsubscribe) => unsubscribe())
      }
    },
    [input]
  )

  const getSnapshot = useCallback(
    () => stores.every((store) => store.persist.hasHydrated()),
    [input]
  )

  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
