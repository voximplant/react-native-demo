import { createStore, type StoreApi } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { PermissionState } from './permissions.types'

type State = {
  permissions: PermissionState
}

type Actions = {
  requestPermissions: () => Promise<void>
}

export type PermissionsStoreState = State & Actions
export type PermissionsStore = StoreApi<PermissionsStoreState>

export const createPermissionsStore = (
  request: () => Promise<PermissionState | null>
): PermissionsStore => {
  return createStore<PermissionsStoreState>()(
    immer((set) => ({
      permissions: {
        microphone: null,
        camera: null
      },

      requestPermissions: async () => {
        const permissions = await request()
        if (!permissions) return

        set((s) => {
          s.permissions = permissions
        })
      }
    }))
  )
}
