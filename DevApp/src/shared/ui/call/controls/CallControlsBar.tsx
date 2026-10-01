import { SPACING } from '@/styles/theme'
import type { ReactNode } from 'react'
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native'

type Props = {
  style?: StyleProp<ViewStyle>
  children: ReactNode
}

export const CallControlsBar: React.FC<Props> = ({ style, children }) => (
  <View style={[styles.container, style]}>{children}</View>
)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.m,
    paddingHorizontal: SPACING.content,
    paddingVertical: SPACING.m
  }
})
