import { useStore } from 'zustand'
import { useStrictContext } from '../utils/useStrictContext'
import type { PermissionsStoreState } from './permissions.store'
import { PermissionsContext } from './PermissionsProvider'

export const usePermissions = <T>(
  selector: (state: PermissionsStoreState) => T
): T => {
  const store = useStrictContext(PermissionsContext, 'usePermissions')

  return useStore(store, selector)
}
