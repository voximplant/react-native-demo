import { useThemeTokens } from '@/providers/theme'
import { SHAPE, SPACING } from '@/styles/theme'
import { useCallback, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Button } from '../Button'
import { Text } from '../Text'
import { RadioListItem } from './RadioListItem'
import type { RadioListOption, RadioListOptionId } from './radioList.types'

type Props<T> = {
  title?: string
  options: RadioListOption<T>[]
  selectedId: RadioListOptionId | null
  onConfirm: (value: T) => void
  onCancel: () => void
}

export const RadioList = <T,>({
  title,
  options,
  selectedId,
  onConfirm,
  onCancel
}: Props<T>) => {
  const theme = useThemeTokens()

  const [draftId, setDraftId] = useState<RadioListOptionId | null>(selectedId)

  const handleOptionPress = useCallback((id: string) => {
    setDraftId(id)
  }, [])

  const handleConfirm = () => {
    const option = options.find((o) => o.id === draftId)
    if (!option) return
    onConfirm(option.value)
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {title && (
        <Text variant='heading_1' style={styles.title}>
          {title}
        </Text>
      )}

      <View style={styles.body}>
        <View
          style={[styles.content, { backgroundColor: theme.colors.surface }]}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {options.map((option) => (
              <RadioListItem
                key={option.id}
                id={option.id}
                label={option.label}
                selected={option.id === draftId}
                onPress={handleOptionPress}
              />
            ))}
          </ScrollView>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          variant='flat-secondary'
          size='sm'
          label='Cancel'
          onPress={onCancel}
          style={styles.footerButton}
        />
        <Button
          variant='flat'
          size='sm'
          label='OK'
          onPress={handleConfirm}
          style={styles.footerButton}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    width: '100%',
    padding: SPACING.l,
    borderRadius: SHAPE.borderRadius.l
  },
  title: {
    marginBottom: SPACING.l
  },
  body: {
    paddingHorizontal: SPACING.xs
  },
  content: {
    maxHeight: 360,
    borderRadius: SHAPE.borderRadius.m,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.xs
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: SPACING.l
  },
  footerButton: { width: 80 }
})
