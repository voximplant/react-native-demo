import { useSettingsNavigation } from '@/navigation'
import { useSettings } from '@/providers/settings'
import { RadioList, ScreenBackdrop, type RadioListOption } from '@/shared/ui'
import { SPACING } from '@/styles/theme'
import { capitalize } from '@/utils'
import { AudioDeviceType } from '@voximplant/react-native-core'
import { StyleSheet, View } from 'react-native'
import { AUDIO_DEVICE_OPTIONS } from '../constants/audioDeviceType'

const OPTIONS: RadioListOption<AudioDeviceType>[] = AUDIO_DEVICE_OPTIONS.map(
  (v) => ({
    id: v,
    label: capitalize(v, { lowercaseRest: true }),
    value: v
  })
)

export const AudioDeviceTypeSelectScreen = () => {
  const navigation = useSettingsNavigation()
  const audioDeviceType = useSettings((s) => s.audioDeviceType)
  const setAudioDeviceType = useSettings((s) => s.setAudioDeviceType)

  return (
    <ScreenBackdrop onPress={navigation.goBack}>
      <View style={styles.container}>
        <RadioList
          title='Audio device type'
          options={OPTIONS}
          selectedId={audioDeviceType}
          onConfirm={(value) => {
            setAudioDeviceType(value)
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
