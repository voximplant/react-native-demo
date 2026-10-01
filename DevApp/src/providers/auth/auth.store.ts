import {
  toFullUsername,
  type LoginParams,
  type SDKService
} from '@/services/sdk'
import type { PersistedStoreApi } from '@/utils'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { LoginTokens } from '@voximplant/react-native-core'
import { createStore } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { AuthStatus, type AuthData } from './auth.types'

export const AUTH_DATA_EMPTY: AuthData = {
  username: '',
  password: '',
  node: null,
  gateway: null
}

type State = {
  status: AuthStatus
  data: AuthData
  tokens: LoginTokens | null
}

type PersistedState = Pick<State, 'data' | 'tokens'>

type Actions = {
  setDataProperty: <P extends keyof AuthData>(
    property: P,
    value: AuthData[P]
  ) => void
  passwordLogin: (params: LoginParams) => Promise<void>
  otkLogin: (params: LoginParams) => Promise<void>
  restore: () => Promise<void>
  logout: () => Promise<void>
}

export type AuthStoreState = State & Actions
export type AuthStore = PersistedStoreApi<AuthStoreState, PersistedState>

const setAuthenticated = (
  set: (fn: (s: State) => void) => void,
  tokens: LoginTokens
) => {
  set((s) => {
    s.tokens = tokens
    s.status = AuthStatus.AUTHENTICATED
  })
}

type CreateAuthStoreParams = {
  sdkService: SDKService
}

export const createAuthStore = ({
  sdkService
}: CreateAuthStoreParams): AuthStore =>
  createStore<AuthStoreState>()(
    persist(
      immer((set, get) => ({
        status: AuthStatus.HYDRATING,
        data: AUTH_DATA_EMPTY,
        tokens: null,

        setDataProperty: (property, value) => {
          set((s) => {
            s.data[property] = value
          })
        },

        passwordLogin: async (params) => {
          const result = await sdkService.passwordLogin(params)

          if (!result.loginTokens) {
            throw new Error('Login failed')
          }

          setAuthenticated(set, result.loginTokens)
        },

        otkLogin: async (params) => {
          const result = await sdkService.otkLogin(params)

          if (!result.loginTokens) {
            throw new Error('Login failed')
          }

          setAuthenticated(set, result.loginTokens)
        },

        restore: async () => {
          const { tokens, data } = get()

          set((s) => {
            s.status = AuthStatus.RESTORING
          })

          if (!tokens || !data.username || !data.node) {
            set((s) => {
              s.status = AuthStatus.UNAUTHENTICATED
            })
            return
          }

          try {
            const result = await sdkService.restoreLogin({
              username: toFullUsername(data.username),
              tokens,
              node: data.node,
              gateway: data.gateway ?? undefined
            })

            if (!result) {
              throw new Error('Restore failed')
            }

            setAuthenticated(set, result)
          } catch (err) {
            set((s) => {
              s.tokens = null
              s.status = AuthStatus.UNAUTHENTICATED
            })
          }
        },

        logout: async () => {
          await sdkService.disconnect({ silent: true })
          set((s) => {
            s.tokens = null
            s.status = AuthStatus.UNAUTHENTICATED
          })
        }
      })),
      {
        name: 'auth',
        storage: createJSONStorage<PersistedState>(() => AsyncStorage),
        partialize: (state): PersistedState => ({
          data: {
            username: state.data.username,
            password: state.data.password,
            node: state.data.node,
            gateway: state.data.gateway
          },
          tokens: state.tokens
        })
      }
    )
  )
