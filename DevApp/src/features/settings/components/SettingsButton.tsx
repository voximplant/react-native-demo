import { useMainNavigation } from '@/navigation'
import { IconButton } from '@/shared/ui'

export const SettingsButton = () => {
  const navigation = useMainNavigation()

  return (
    <IconButton
      name='settings'
      onPress={() => navigation.navigate('Settings')}
      size={28}
    />
  )
}
