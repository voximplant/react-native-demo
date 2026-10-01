import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { Alert } from 'react-native'
import {
  incomingCallFormSchema,
  type IncomingCallFormData
} from './incomingCallForm.schema'

const DEFAULT_VALUES: IncomingCallFormData = {
  muteAudio: false,
  receiveVideo: false
}

type Props = {
  callId: string | null
}

export const useIncomingCallForm = ({ callId }: Props) => {
  const {
    control,
    handleSubmit: RHFHandleSubmit,
    reset
  } = useForm<IncomingCallFormData>({
    defaultValues: DEFAULT_VALUES,
    resolver: zodResolver(incomingCallFormSchema)
  })

  const handleSubmit = useCallback(
    (onValid: SubmitHandler<IncomingCallFormData>) =>
      RHFHandleSubmit(onValid, (submitErrors) => {
        const message = Object.values(submitErrors)
          .map((e) => e?.message)
          .filter(Boolean)
          .join('\n')
        Alert.alert(
          'Could not answer',
          message || 'Check your call settings and try again.'
        )
      }),
    [RHFHandleSubmit]
  )

  useEffect(() => {
    if (callId) reset()
  }, [callId, reset])

  return { control, handleSubmit }
}
