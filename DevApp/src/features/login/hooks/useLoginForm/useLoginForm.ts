import { AUTH_DATA_EMPTY, useAuth, useAuthStore } from '@/providers/auth'
import { useGlobalLoading } from '@/providers/globalLoading'
import { USERNAME_SUFFIX, type LoginParams } from '@/services/sdk'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Alert } from 'react-native'
import { isLoginFieldName } from './loginForm.guards'
import { loginfFormSchema, type LoginFormData } from './loginForm.schema'
import { getLoginFormDefaults } from './loginForm.utils'

export const useLoginForm = () => {
  const store = useAuthStore()
  const setDataProperty = useAuth((s) => s.setDataProperty)
  const passwordLogin = useAuth((s) => s.passwordLogin)
  const otkLogin = useAuth((s) => s.otkLogin)
  const setGlobalLoading = useGlobalLoading((s) => s.setLoading)

  const { control, handleSubmit, formState, subscribe, setError } =
    useForm<LoginFormData>({
      defaultValues: () => getLoginFormDefaults(store),
      resetOptions: {
        keepDefaultValues: true
      },
      resolver: zodResolver(loginfFormSchema)
    })

  useEffect(() => {
    if (!formState.isLoading) return
    setGlobalLoading(true)

    return () => {
      setGlobalLoading(false)
    }
  }, [formState.isLoading, setGlobalLoading])

  useEffect(() => {
    if (!formState.isSubmitting) return
    setGlobalLoading(true)

    return () => {
      setGlobalLoading(false)
    }
  }, [formState.isSubmitting, setGlobalLoading])

  useEffect(() => {
    const unsubscribe = subscribe({
      formState: { values: true },
      callback: ({ values, isLoading, name }) => {
        if (isLoading || !isLoginFieldName(name)) return

        const value = values[name] ?? AUTH_DATA_EMPTY[name]
        setDataProperty(name, value)
      }
    })

    return () => unsubscribe()
  }, [subscribe, setDataProperty])

  const login = async (method: 'password' | 'otk') => {
    return handleSubmit(async (data) => {
      try {
        if (!data.node) {
          setError('node', { type: 'required', message: 'Node is required' })
          return
        }

        const params: LoginParams = {
          username: `${data.username}${USERNAME_SUFFIX}`,
          password: data.password,
          node: data.node,
          gateway: data.gateway || undefined
        }

        await (method === 'password' ? passwordLogin(params) : otkLogin(params))
      } catch (err) {
        Alert.alert('Login failed', String(err))
      }
    })()
  }

  return {
    login,
    control,
    formState
  }
}
