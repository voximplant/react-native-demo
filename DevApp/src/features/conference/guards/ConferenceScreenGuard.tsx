import { useResetMainNavigation } from '@/navigation'
import { sdkService } from '@/services/sdk'
import { logger } from '@/utils'
import type { Conference } from '@voximplant/react-native-calls'
import { useEffect } from 'react'

type Props = {
  conferenceId: string
  children: (conference: Conference) => React.ReactNode
}

export const ConferenceScreenGuard: React.FC<Props> = ({
  conferenceId,
  children
}) => {
  const resetMainNavigation = useResetMainNavigation()
  const conference = sdkService.callManager.getConference(conferenceId)

  useEffect(() => {
    if (!conference) {
      logger.error('CONFERENCE', 'conference not found', { conferenceId })
      resetMainNavigation()
    }
  }, [conference, resetMainNavigation])

  if (!conference) return null

  return <>{children(conference)}</>
}
