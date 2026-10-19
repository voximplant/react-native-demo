import {
  toFullUsername,
  type LoginParams,
  type SDKService
} from '@/services/sdk'
import { type PersistedStoreApi } from '@/utils'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { type LoginTokens } from '@voximplant/react-native-core'
import type { WritableDraft } from 'immer'
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

type Reducer = (s: WritableDraft<State>) => void

const reducers = {
  setAuthenticated: (tokens: LoginTokens) => (s) => {
    s.tokens = tokens
    s.status = AuthStatus.AUTHENTICATED
  },
  setUnauthenticated: () => (s) => {
    s.tokens = null
    s.status = AuthStatus.UNAUTHENTICATED
  }
} satisfies Record<string, (...args: never[]) => Reducer>

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

          set(reducers.setAuthenticated(result.loginTokens))
        },

        otkLogin: async (params) => {
          const result = await sdkService.otkLogin(params)

          if (!result.loginTokens) {
            throw new Error('Login failed')
          }

          set(reducers.setAuthenticated(result.loginTokens))
        },

        restore: async () => {
          const { tokens, data, status } = get()

          if (status === AuthStatus.RESTORING) {
            return
          }

          set((s) => {
            s.status = AuthStatus.RESTORING
          })

          if (!tokens || !data.username || !data.node) {
            set(reducers.setUnauthenticated())
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

            set(reducers.setAuthenticated(result))
          } catch (err) {
            set(reducers.setUnauthenticated())
          }
        },

        logout: async () => {
          await sdkService.disconnect({ silent: true })
          set(reducers.setUnauthenticated())
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
