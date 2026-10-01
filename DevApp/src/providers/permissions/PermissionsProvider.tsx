import {
  createContext,
  useEffect,
  useState,
  type PropsWithChildren
} from 'react'
import { Platform } from 'react-native'
import { PERMISSIONS, requestMultiple } from 'react-native-permissions'
import {
  createPermissionsStore,
  type PermissionsStore
} from './permissions.store'
import type { PermissionState } from './permissions.types'
import { useStore } from 'zustand'

type PermissionsCtx = PermissionsStore

export const PermissionsContext = createContext<PermissionsCtx | null>(null)

const PERMISSIONS_TO_REQUEST = Platform.select({
  ios: {
    microphone: PERMISSIONS.IOS.MICROPHONE,
    camera: PERMISSIONS.IOS.CAMERA
  },
  android: {
    microphone: PERMISSIONS.ANDROID.RECORD_AUDIO,
    camera: PERMISSIONS.ANDROID.CAMERA
  }
})

const requestAppPermissions = async (): Promise<PermissionState | null> => {
  if (!PERMISSIONS_TO_REQUEST) return null

  const keys = Object.values(PERMISSIONS_TO_REQUEST)
  const statuses = await requestMultiple(keys)

  return {
    microphone: statuses[PERMISSIONS_TO_REQUEST.microphone],
    camera: statuses[PERMISSIONS_TO_REQUEST.camera]
  }
}

export const PermissionsProvider: React.FC<PropsWithChildren> = ({
  children
}) => {
  const [store] = useState(() => createPermissionsStore(requestAppPermissions))
  const requestPermissions = useStore(store, (s) => s.requestPermissions)

  useEffect(() => {
    requestPermissions()
  }, [requestPermissions])

  return (
    <PermissionsContext.Provider value={store}>
      {children}
    </PermissionsContext.Provider>
  )
}
