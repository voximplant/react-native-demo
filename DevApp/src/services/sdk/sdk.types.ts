import type { ConnectionNode, LoginTokens } from '@voximplant/react-native-core'

export interface LoginParams {
  username: string
  password: string
  node: ConnectionNode
  gateway?: string
}

export interface TokenLoginParams {
  username: string
  tokens: LoginTokens
  node: ConnectionNode
  gateway?: string
}
