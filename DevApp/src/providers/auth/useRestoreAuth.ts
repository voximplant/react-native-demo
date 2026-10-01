import { useIsMounted } from '@/shared/hooks'
import { waitForHydration } from '@/utils'
import { useEffect } from 'react'
import type { AuthStore } from './auth.store'

export const useRestoreAuth = (store: AuthStore) => {
  const isMounted = useIsMounted()

  useEffect(() => {
    const run = async () => {
      await waitForHydration(store)

      if (!isMounted()) return

      await store.getState().restore()
    }

    run()
  }, [isMounted, store])
}
