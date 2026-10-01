import type { Watchable } from '@voximplant/react-native-shared'
import { useCallback, useSyncExternalStore } from 'react'

export const useWatchable = <T>(
  watchable: Watchable<T>
): [T, (next: T) => void] => {
  const subscribe = useCallback(
    (onStoreChange: () => void) => watchable.watch(onStoreChange),
    [watchable]
  )

  const getSnapshot = useCallback(() => watchable.value, [watchable])

  const value = useSyncExternalStore(subscribe, getSnapshot)

  const setValue = useCallback(
    (next: T) => {
      watchable.value = next
    },
    [watchable]
  )

  return [value, setValue]
}
