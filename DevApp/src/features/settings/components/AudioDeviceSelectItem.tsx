import { useSettingsNavigation } from '@/navigation'
import { useSettings } from '@/providers/settings'
import { ListItemNav } from '@/shared/ui'
import { capitalize } from '@/utils'
import type { AudioDevice } from '@voximplant/react-native-core'

const getSelectedDeviceLabel = (
  selectedAudioDevice: AudioDevice | null,
  audioDevices: AudioDevice[]
): string => {
  if (audioDevices.length === 0) return 'No devices'
  if (!selectedAudioDevice) return 'Not selected'

  return capitalize(selectedAudioDevice.name, { lowercaseRest: true })
}

export const AudioDeviceSelectItem = () => {
  const selectedAudioDevice = useSettings((s) => s.selectedAudioDevice)
  const audioDevices = useSettings((s) => s.audioDevices)
  const { navigate } = useSettingsNavigation()

  return (
    <ListItemNav
      label='Selected'
      value={getSelectedDeviceLabel(selectedAudioDevice, audioDevices)}
      onPress={() => navigate('AudioDeviceSelect')}
      disabled={!audioDevices.length}
    />
  )
}
