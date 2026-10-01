import type { AnyPersistedStore } from './store.types'

type WaitForHydrationInput = AnyPersistedStore | AnyPersistedStore[]

export const waitForHydration = async (
  input: WaitForHydrationInput
): Promise<void> => {
  const stores = Array.isArray(input) ? input : [input]

  await Promise.all(
    stores.map(
      (store) =>
        new Promise<void>((resolve) => {
          if (store.persist.hasHydrated()) {
            resolve()
            return
          }

          let unsubscribe = () => {}

          const finish = () => {
            unsubscribe()
            resolve()
          }

          unsubscribe = store.persist.onFinishHydration(finish)

          if (store.persist.hasHydrated()) {
            finish()
          }
        })
    )
  )
}
