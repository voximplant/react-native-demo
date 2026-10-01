import type { PermissionStatus } from 'react-native-permissions'

export type PermissionState = {
  microphone: PermissionStatus | null
  camera: PermissionStatus | null
}
