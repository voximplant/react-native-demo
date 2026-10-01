import type { TouchableOpacityProps } from "react-native"
import type { IconName } from "../Icon/icons"

export type IconButtonVariant = 'standard' | 'filled' | 'tonal' | 'outlined'

export type IconButtonProps = TouchableOpacityProps & {
  name: IconName
  size?: number
  color?: string
  variant?: IconButtonVariant
  grow?: boolean
}
