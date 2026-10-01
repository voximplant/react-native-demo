import type { MainStackParamList } from '@/navigation'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

export const useMainNavigation = () =>
  useNavigation<NativeStackNavigationProp<MainStackParamList>>()
