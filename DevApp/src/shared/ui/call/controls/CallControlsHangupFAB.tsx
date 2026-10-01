import { FAB } from '@/shared/ui'
import { COLORS } from '@/styles/theme'
import type { StyleProp, ViewStyle } from 'react-native'

type Props = {
  onPress: () => void
  style?: StyleProp<ViewStyle>
}

export const CallControlsHangupFAB: React.FC<Props> = ({ onPress, style }) => (
  <FAB
    icon='phone-off'
    size='md'
    onPress={onPress}
    style={[{ backgroundColor: COLORS.red500 }, style]}
  />
)
