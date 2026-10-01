import { useThemeTokens } from '@/providers/theme'
import { SHAPE, SPACING } from '@/styles/theme'
import { memo, useState } from 'react'
import {
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle
} from 'react-native'
import { useFieldBorderColor } from '../../hooks/useFieldBorderColor'
import { Text, TEXT_VARIANT_STYLE } from './Text'

type Props = TextInputProps & {
  label?: string
  caption?: string
  hideCaption?: boolean
  error?: string
  containerStyle?: StyleProp<ViewStyle>
  suffix?: string
}

export const Input: React.FC<Props> = memo(
  ({
    label,
    caption,
    hideCaption,
    error,
    style,
    containerStyle,
    suffix,
    ...props
  }) => {
    const theme = useThemeTokens()
    const [focused, setFocused] = useState(false)
    const borderColor = useFieldBorderColor(focused, error)

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text
            style={[
              styles.label,
              {
                color: theme.colors.labelText
              }
            ]}
          >
            {label}
          </Text>
        )}

        <View
          style={[
            styles.inputWrapper,
            !hideCaption && styles.inputWrapperWithCaption,
            {
              backgroundColor: theme.colors.background,
              borderColor
            }
          ]}
        >
          <TextInput
            style={[
              styles.input,
              {
                color: theme.colors.text
              },
              style
            ]}
            cursorColor={theme.colors.accent}
            selectionColor={theme.colors.accent}
            placeholderTextColor={theme.colors.textSecondary}
            onFocus={(e) => {
              setFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setFocused(false)
              props.onBlur?.(e)
            }}
            autoCapitalize='none'
            autoComplete='off'
            autoCorrect={false}
            {...props}
          />

          {suffix && (
            <Text
              style={[
                {
                  color: theme.colors.textSecondary
                }
              ]}
            >
              {suffix}
            </Text>
          )}
        </View>

        {!hideCaption && (error || caption) && (
          <Text
            style={[
              styles.caption,
              {
                color: error ? theme.colors.error : theme.colors.captionText
              }
            ]}
          >
            {error ?? caption}
          </Text>
        )}
      </View>
    )
  }
)

const styles = StyleSheet.create({
  container: {},
  label: {
    ...TEXT_VARIANT_STYLE.body,
    marginBottom: SPACING.labelGap
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: SHAPE.borderRadius.s,
    height: TEXT_VARIANT_STYLE.body.lineHeight + SPACING.inputPaddingV * 2,
    paddingHorizontal: SPACING.inputPaddingH
  },
  inputWrapperWithCaption: {
    marginBottom: TEXT_VARIANT_STYLE.caption.lineHeight + SPACING.labelGap
  },
  input: {
    ...TEXT_VARIANT_STYLE.body,
    flex: 1,
    textAlignVertical: 'center',
    padding: 0
  },
  caption: {
    ...TEXT_VARIANT_STYLE.caption,
    position: 'absolute',
    bottom: 0
  }
})
