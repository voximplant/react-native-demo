import { useThemeTokens } from '@/providers/theme'
import {
  ActivityIndicator as RNActivityIndicator,
  type ActivityIndicatorProps
} from 'react-native'

export const ActivityIndicator: React.FC<ActivityIndicatorProps> = ({
  ...props
}) => {
  const theme = useThemeTokens()

  return <RNActivityIndicator color={theme.colors.accent} {...props} />
}
