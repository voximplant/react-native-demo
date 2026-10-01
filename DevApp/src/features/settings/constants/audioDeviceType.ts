import { AudioDeviceType } from '@voximplant/react-native-core'

const EXCLUDED_AUDIO_DEVICE_TYPE: AudioDeviceType[] = [
  AudioDeviceType.Unsupported,
]

export const AUDIO_DEVICE_OPTIONS = Object.values(AudioDeviceType).filter(
  (v) => !EXCLUDED_AUDIO_DEVICE_TYPE.includes(v)
)
