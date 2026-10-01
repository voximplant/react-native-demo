import { useSettingsNavigation } from '@/navigation'
import { useSettings } from '@/providers/settings'
import { RadioList, ScreenBackdrop, type RadioListOption } from '@/shared/ui'
import { SPACING } from '@/styles/theme'
import { capitalize } from '@/utils'
import type { AudioDevice } from '@voximplant/react-native-core'
import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

export const AudioDeviceSelectScreen = () => {
  const navigation = useSettingsNavigation()

  const audioDevices = useSettings((s) => s.audioDevices)
  const selectedAudioDevice = useSettings((s) => s.selectedAudioDevice)
  const selectAudioDevice = useSettings((s) => s.selectAudioDevice)

  const options = useMemo<RadioListOption<AudioDevice>[]>(
    () =>
      audioDevices.map((d) => ({
        id: String(d.id),
        label: capitalize(d.name, { lowercaseRest: true }),
        value: d
      })),
    [audioDevices]
  )

  return (
    <ScreenBackdrop onPress={navigation.goBack}>
      <View style={styles.container}>
        <RadioList
          title='Audio device'
          options={options}
          selectedId={selectedAudioDevice?.id ?? null}
          onConfirm={(device) => {
            selectAudioDevice(device)
            navigation.goBack()
          }}
          onCancel={navigation.goBack}
        />
      </View>
    </ScreenBackdrop>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl
  }
})
