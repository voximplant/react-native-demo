import { useThemeTokens } from '@/providers/theme'
import { Text as RNText, type TextProps as RNTextProps } from 'react-native'
import { TEXT_VARIANT_STYLE } from './text.styles'
import type { TextVariant } from './text.types'

export type TextProps = RNTextProps & {
  variant?: TextVariant
}

export const Text: React.FC<TextProps> = ({
  style,
  variant = 'body',
  ...props
}) => {
  const theme = useThemeTokens()

  return (
    <RNText
      style={[
        variant && TEXT_VARIANT_STYLE[variant],
        { color: theme.colors.text },
        style
      ]}
      {...props}
    />
  )
}
