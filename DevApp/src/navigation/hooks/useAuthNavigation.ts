import type { AuthStackParamList } from '@/navigation'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

export const useAuthNavigation = () =>
  useNavigation<NativeStackNavigationProp<AuthStackParamList>>()
