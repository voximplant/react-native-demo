import type { AuthStore } from '@/providers/auth'
import { waitForHydration } from '@/utils'
import type { LoginFormData } from './loginForm.schema'

export const getLoginFormDefaults = async (
  store: AuthStore
): Promise<LoginFormData> => {
  await waitForHydration(store)

  const { username, password, node, gateway } = store.getState().data

  return { username, password, node, gateway: gateway ?? undefined }
}
