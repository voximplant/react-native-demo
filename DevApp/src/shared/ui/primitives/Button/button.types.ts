import type { SizeVariant } from '@/styles/theme'
import type { TextStyle, TouchableOpacityProps } from 'react-native'

export type ButtonVariant = 'primary' | 'secondary' | 'flat' | 'flat-secondary'

export type ButtonProps = TouchableOpacityProps & {
  label: string
  size?: SizeVariant
  variant?: ButtonVariant
  processing?: boolean
  onPress?: () => void
  labelStyle?: TextStyle
}
