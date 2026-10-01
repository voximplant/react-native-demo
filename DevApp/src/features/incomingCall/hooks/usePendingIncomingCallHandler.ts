import { useMainNavigation } from '@/navigation'
import { usePendingIncomingCall } from '@/providers/pendingIncomingCall'
import { useEffect } from 'react'

export const usePendingIncomingCallHandler = () => {
  const navigation = useMainNavigation()
  const listen = usePendingIncomingCall((s) => s.listen)

  useEffect(() => {
    const unsubscribe = listen(({ callId, withVideo }) => {
      navigation.navigate('IncomingCall', { callId, withVideo })
    })

    return () => {
      unsubscribe()
    }
  }, [navigation, listen])
}
