import { useThemeTokens } from '@/providers/theme'
import { Text } from '@/shared/ui'
import { SPACING } from '@/styles/theme'
import { Pressable, StyleSheet } from 'react-native'
import { Icon } from '../Icon'

type Props = {
  label: string
  value?: string
  onPress: () => void
  disabled?: boolean
}

export const ListItemNav: React.FC<Props> = ({
  label,
  value,
  onPress,
  disabled
}) => {
  const theme = useThemeTokens()

  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        { opacity: pressed ? theme.opacity.pressed : 1 }
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text variant='body' style={styles.label}>
        {label}
      </Text>

      {value && (
        <Text
          variant='body'
          style={{
            color: disabled
              ? theme.colors.textDisabled
              : theme.colors.textSecondary
          }}
        >
          {value}
        </Text>
      )}

      {!disabled && (
        <Icon name='chevron-right' size={24} color={theme.colors.icon} />
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.s,
    gap: SPACING.s
  },
  label: { flex: 1 }
})
