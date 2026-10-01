import type { ConnectionNode } from '@voximplant/react-native-core'

export enum AuthStatus {
  HYDRATING = 'HYDRATING',
  RESTORING = 'RESTORING',
  AUTHENTICATED = 'AUTHENTICATED',
  UNAUTHENTICATED = 'UNAUTHENTICATED'
}

export type AuthData = {
  username: string
  password: string
  node: ConnectionNode | null
  gateway: string | null
}
