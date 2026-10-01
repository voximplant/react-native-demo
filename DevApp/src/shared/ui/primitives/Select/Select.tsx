import { useThemeTokens } from '@/providers/theme'
import { useFieldBorderColor } from '@/shared/hooks'
import { SPACING } from '@/styles/theme'
import { Picker } from '@react-native-picker/picker'
import type { ReactElement } from 'react'
import { memo, useState } from 'react'
import { Keyboard, StyleSheet, View } from 'react-native'
import { Text } from '../Text'
import { selectStyles } from './select.styles'
import type { SelectProps } from './select.types'

const SelectComponent = <Value extends string>({
  value,
  error,
  label,
  caption,
  options,
  placeholder = 'Select...',
  onChange
}: SelectProps<Value>) => {
  const theme = useThemeTokens()
  const [focused, setFocused] = useState(false)
  const borderColor = useFieldBorderColor(focused, error)

  return (
    <View style={styles.container}>
      {label && (
        <Text
          style={[
            styles.label,
            { color: theme.colors.labelText, marginBottom: theme.spacing.xs }
          ]}
        >
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputWrapper,
          {
            borderColor,
            backgroundColor: theme.colors.background
          }
        ]}
      >
        <Picker
          mode='dialog'
          selectedValue={value ?? undefined}
          onValueChange={onChange}
          style={[
            styles.input,
            {
              color: theme.colors.text
            }
          ]}
          dropdownIconColor={theme.colors.icon}
          itemStyle={{ color: theme.colors.text }}
          onFocus={() => {
            Keyboard.dismiss()
            setFocused(true)
          }}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
        >
          {!value && (
            <Picker.Item
              label={placeholder}
              value={undefined}
              color={theme.colors.placeholder}
            />
          )}

          {options.map((o) => (
            <Picker.Item
              key={o.value}
              label={o.label}
              value={o.value}
              color={theme.colors.text}
            />
          ))}
        </Picker>
      </View>

      {(error || caption) && (
        <Text
          style={[
            styles.caption,
            { color: error ? theme.colors.error : theme.colors.captionText }
          ]}
        >
          {error ?? caption}
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  ...selectStyles,
  inputWrapper: {
    ...selectStyles.inputWrapper,
    // @react-native-picker/picker padding fix
    paddingHorizontal: SPACING.inputPaddingH - 8
  }
})

export const Select = memo(SelectComponent) as <Value extends string>(
  props: SelectProps<Value>
) => ReactElement
