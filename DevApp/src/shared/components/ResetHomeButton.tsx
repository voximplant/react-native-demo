import { useResetMainNavigation } from '@/navigation'
import { IconButton } from '../ui'

export const ResetHomeButton = () => {
  const resetMainNavigation = useResetMainNavigation()

  return <IconButton name='home' onPress={resetMainNavigation} size={28} />
}
