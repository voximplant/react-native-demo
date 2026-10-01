import type { ReadonlyWatchable } from '@voximplant/react-native-shared'
import { startTransition, useCallback, useOptimistic } from 'react'
import { useReadonlyWatchable } from './useReadonlyWatchable'

type SetOptimistic<T> = (next: T, action: () => Promise<void>) => void

/**
 * Optimistic value over a SDK `ReadonlyWatchable`.
 * Returns `[value, setOptimistic]` - `value` updates immediately, then reconciles when the watchable emits.
 *
 * @example
 * function useCallMute(call: Call) {
 *   const [isMuted, setMuted] = useOptimisticReadonlyWatchable(call.isMuted)
 *
 *   const mute = (value: boolean) => {
 *     setMuted(value, async () => call.mute(value))
 *   }
 *
 *   return { isMuted, mute }
 * }
 */
export const useOptimisticReadonlyWatchable = <T>(
  watchable: ReadonlyWatchable<T>
): [T, SetOptimistic<T>] => {
  const realValue = useReadonlyWatchable(watchable)
  const [optimistic, setOptimistic] = useOptimistic(
    realValue,
    (_, next: T) => next
  )

  const set = useCallback<SetOptimistic<T>>(
    (next, action) => {
      startTransition(async () => {
        setOptimistic(next)
        await action()
      })
    },
    [setOptimistic]
  )

  return [optimistic, set]
}
