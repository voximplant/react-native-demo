import { SPACING } from '@/styles/theme'
import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { Text } from '../Text'
import { Switch } from './Switch'

type Props = {
  label: string
  value: boolean
  onValueChange: (value: boolean) => void
}

export const SwitchField: React.FC<Props> = memo(
  ({ label, value, onValueChange }) => {
    return (
      <View style={styles.row}>
        <Text variant='body' style={styles.label}>
          {label}
        </Text>
        <Switch value={value} onValueChange={onValueChange} />
      </View>
    )
  }
)

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s + SPACING.xs
  },
  label: { flex: 1 }
})
