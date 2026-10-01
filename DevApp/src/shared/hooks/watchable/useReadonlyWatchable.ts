import type { ReadonlyWatchable } from '@voximplant/react-native-shared'
import { useCallback, useSyncExternalStore } from 'react'

export const useReadonlyWatchable = <T>(watchable: ReadonlyWatchable<T>) => {
  const subscribe = useCallback(
    (onStoreChange: () => void) => watchable.watch(onStoreChange),
    [watchable]
  )
  const getSnapshot = useCallback(() => watchable.value, [watchable])

  const value = useSyncExternalStore(subscribe, getSnapshot)

  return value
}
