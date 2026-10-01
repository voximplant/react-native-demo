import { useEffect } from 'react'
import { useActiveSession } from './useActiveSession'

export const useActiveSessionLifecycle = (sessionId: string): void => {
  const setActiveSession = useActiveSession((s) => s.setActiveSession)
  const clearActiveSession = useActiveSession((s) => s.clearActiveSession)

  useEffect(() => {
    setActiveSession(sessionId)

    return clearActiveSession
  }, [sessionId, setActiveSession, clearActiveSession])
}
