import { useResetMainNavigation } from '@/navigation'
import { sdkService } from '@/services/sdk'
import { logger } from '@/utils'
import type { Call } from '@voximplant/react-native-calls'
import { useEffect } from 'react'

type Props = {
  callId: string
  children: (call: Call) => React.ReactNode
}

export const CallScreenGuard: React.FC<Props> = ({ callId, children }) => {
  const resetMainNavigation = useResetMainNavigation()
  const call = sdkService.callManager.getCall(callId)

  useEffect(() => {
    if (!call) {
      logger.error('CALL', 'call not found', { callId })
      resetMainNavigation()
    }
  }, [call, resetMainNavigation])

  if (!call) return null

  return <>{children(call)}</>
}
