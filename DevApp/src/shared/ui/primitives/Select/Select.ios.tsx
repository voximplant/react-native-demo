import { useThemeTokens } from '@/providers/theme'
import { useFieldBorderColor } from '@/shared/hooks'
import { Picker } from '@react-native-picker/picker'
import type { ReactElement } from 'react'
import { memo, useState } from 'react'
import { Keyboard, Pressable, StyleSheet, View } from 'react-native'
import { BottomSheetModal } from '../BottomSheetModal'
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
  const [open, setOpen] = useState(false)
  const [draftValue, setDraftValue] = useState<Value | null>(value)
  const borderColor = useFieldBorderColor(open, error)

  const selectedLabel = options.find((o) => o.value === value)?.label

  const handleOpen = () => {
    Keyboard.dismiss()
    const initialDraftValue = value ?? options[0]?.value ?? null
    setDraftValue(initialDraftValue)
    setOpen(true)
  }

  const handleConfirm = () => {
    if (draftValue !== null) onChange(draftValue)
    setOpen(false)
  }

  return (
    <View style={styles.container}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: theme.colors.labelText,
              marginBottom: theme.spacing.xs
            }
          ]}
        >
          {label}
        </Text>
      )}

      <Pressable
        style={[
          styles.inputWrapper,
          {
            borderColor,
            backgroundColor: theme.colors.background
          }
        ]}
        onPress={handleOpen}
      >
        <Text
          style={[
            styles.input,
            {
              color: selectedLabel
                ? theme.colors.text
                : theme.colors.placeholder
            }
          ]}
        >
          {selectedLabel ?? placeholder}
        </Text>
      </Pressable>

      <BottomSheetModal
        visible={open}
        onClose={() => setOpen(false)}
        title={label}
        onConfirm={handleConfirm}
      >
        <Picker
          selectedValue={draftValue ?? undefined}
          onValueChange={(v) => setDraftValue(v)}
          itemStyle={{ color: theme.colors.text }}
        >
          {options.map((o) => (
            <Picker.Item
              key={o.value}
              label={o.label}
              value={o.value}
              color={theme.colors.text}
            />
          ))}
        </Picker>
      </BottomSheetModal>

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
  ...selectStyles
})

export const Select = memo(SelectComponent) as <Value extends string>(
  props: SelectProps<Value>
) => ReactElement
