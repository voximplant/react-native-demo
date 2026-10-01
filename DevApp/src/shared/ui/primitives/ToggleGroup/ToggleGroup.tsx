import { useThemeTokens } from '@/providers/theme'
import { SHAPE, SPACING } from '@/styles/theme'
import { Pressable, StyleSheet, View } from 'react-native'
import { Icon } from '../Icon'
import { Text } from '../Text'
import type { ToggleGroupOption } from './toggleGroup.types'

type Props<T extends string> = {
  options: ToggleGroupOption<T>[]
  value: T
  onChange: (value: T) => void
}

export const ToggleGroup = <T extends string>({
  options,
  value,
  onChange
}: Props<T>) => {
  const theme = useThemeTokens()

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface
        }
      ]}
    >
      {options.map((option) => {
        const selected = option.value === value
        return (
          <Pressable
            key={option.value}
            style={[
              styles.option,
              selected && { backgroundColor: theme.colors.accent }
            ]}
            onPress={() => onChange(option.value)}
          >
            {option.icon && (
              <Icon
                name={option.icon}
                size={16}
                color={
                  selected
                    ? theme.colors.textOnAccent
                    : theme.colors.textSecondary
                }
              />
            )}
            <Text
              variant='heading_3'
              style={{
                color: selected
                  ? theme.colors.textOnAccent
                  : theme.colors.textSecondary
              }}
            >
              {option.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: SPACING.xs,
    borderRadius: SHAPE.borderRadius.s
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.m,
    borderRadius: SHAPE.borderRadius.s
  }
})
