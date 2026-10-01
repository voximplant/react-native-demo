import { useThemeTokens } from '@/providers/theme'
import { SPACING } from '@/styles/theme'
import { type ReactNode } from 'react'
import { Modal, Pressable, StyleSheet, View } from 'react-native'
import { Button } from './Button'
import { Text } from './Text'

type Props = {
  visible: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  onConfirm?: () => void
}

export const BottomSheetModal: React.FC<Props> = ({
  visible,
  onClose,
  children,
  title,
  onConfirm
}) => {
  const theme = useThemeTokens()

  return (
    <Modal visible={visible} transparent animationType='slide'>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View
        style={[
          styles.sheet,
          theme.shadows.bottomSheet,
          {
            backgroundColor: theme.colors.surface,
            borderTopLeftRadius: theme.shape.borderRadius.l,
            borderTopRightRadius: theme.shape.borderRadius.l
          }
        ]}
      >
        <View style={styles.header}>
          <Button
            size='sm'
            label='Cancel'
            variant='flat-secondary'
            onPress={onClose}
            style={styles.headerButton}
          />

          <View style={styles.titleContainer}>
            {title && <Text variant='heading_1'>{title}</Text>}
          </View>

          <Button
            size='sm'
            label='Done'
            variant='flat'
            onPress={onConfirm}
            style={styles.headerButton}
          />
        </View>

        {children}
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1
  },
  sheet: {
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.xs
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingTop: SPACING.m,
    paddingBottom: SPACING.s
  },
  headerButton: {
    width: 80
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center'
  }
})
