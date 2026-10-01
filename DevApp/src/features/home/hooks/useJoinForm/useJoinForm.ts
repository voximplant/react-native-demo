import { logger } from '@/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  JOIN_FORM_EMPTY,
  useJoinFormState,
  useJoinFormStore
} from '../../providers'
import { useJoinCall } from '../useJoinCall'
import { useJoinConference } from '../useJoinConference'
import { isJoinFieldName } from './joinForm.guards'
import {
  JOIN_CONFIG,
  joinFormSchema,
  type JoinFormData
} from './joinForm.schema'
import { getJoinFormDefaults } from './joinForm.utils'

export const useJoinForm = () => {
  const store = useJoinFormStore()
  const setProperty = useJoinFormState((s) => s.setProperty)
  const {
    control,
    handleSubmit,
    watch,
    subscribe,
    clearErrors,
    setError,
    formState
  } = useForm<JoinFormData>({
    defaultValues: () => getJoinFormDefaults(store),
    resetOptions: { keepDefaultValues: true },
    resolver: zodResolver(joinFormSchema)
  })

  const { join: joinCall } = useJoinCall({ setError })
  const { join: joinConference } = useJoinConference({ setError })

  const mode = watch('mode') ?? 'call'

  useEffect(() => {
    const unsubscribe = subscribe({
      name: 'mode',
      formState: { values: true },
      callback: ({ type }) => {
        if (type !== 'change') return
        clearErrors()
      }
    })

    return () => unsubscribe()
  }, [clearErrors, subscribe])

  useEffect(() => {
    const unsubscribe = subscribe({
      formState: { values: true },
      callback: ({ values, isLoading, name }) => {
        if (isLoading || !isJoinFieldName(name)) return

        const value = values[name] ?? JOIN_FORM_EMPTY[name]
        setProperty(name, value)
      }
    })

    return () => unsubscribe()
  }, [subscribe, setProperty])

  const onJoin = handleSubmit((data) => {
    logger.info('HOME', 'join', data)
    if (data.mode === 'call') joinCall(data)
    if (data.mode === 'conference') joinConference(data)
  })

  return {
    control,
    onJoin,
    formState,
    fabIcon: JOIN_CONFIG[mode].fab.icon,
    fabLabel: JOIN_CONFIG[mode].fab.label
  }
}
