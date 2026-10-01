import { useThemeTokens } from '@/providers/theme'
import { Radio, Text } from '@/shared/ui'
import { SPACING } from '@/styles/theme'
import { memo } from 'react'
import { Pressable, StyleSheet } from 'react-native'
import type { RadioListOptionId } from './radioList.types'

type Props = {
  id: RadioListOptionId
  label: string
  selected: boolean
  onPress: (id: string) => void
}

const RadioListItemComponent: React.FC<Props> = ({
  id,
  label,
  selected,
  onPress
}) => {
  const theme = useThemeTokens()

  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        { opacity: pressed ? theme.opacity.pressed : 1 }
      ]}
      onPress={() => onPress(id)}
    >
      <Text variant='body' style={styles.label} numberOfLines={2}>
        {label}
      </Text>
      <Radio selected={selected} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.m
  },
  label: { flex: 1 }
})

export const RadioListItem = memo(RadioListItemComponent)
