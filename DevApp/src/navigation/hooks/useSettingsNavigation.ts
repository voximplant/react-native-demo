import type { SettingsStackParamList } from '@/navigation'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

export const useSettingsNavigation = () =>
  useNavigation<NativeStackNavigationProp<SettingsStackParamList>>()
