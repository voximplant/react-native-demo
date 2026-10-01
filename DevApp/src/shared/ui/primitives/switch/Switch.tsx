import { useThemeTokens } from '@/providers/theme'
import { Platform, Switch as RNSwitch, type SwitchProps } from 'react-native'

export const Switch: React.FC<SwitchProps> = ({ value, ...props }) => {
  const theme = useThemeTokens()

  return (
    <RNSwitch
      thumbColor={Platform.select({
        default: value
          ? theme.colors.accentSecondary
          : theme.colors.textDisabled,
        ios: undefined,
        macos: undefined
      })}
      trackColor={{
        false: theme.colors.border,
        true: theme.colors.accent
      }}
      ios_backgroundColor={theme.colors.border}
      value={value}
      {...props}
    />
  )
}
