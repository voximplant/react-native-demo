import { SPACING } from '@/styles/theme'
import type { PropsWithChildren } from 'react'
import {
  KeyboardAwareScrollView,
  type KeyboardAwareScrollViewProps
} from 'react-native-keyboard-controller'

type Props = PropsWithChildren<KeyboardAwareScrollViewProps>

export const KeyboardAwareScroll: React.FC<Props> = ({
  children,
  ...props
}) => {
  return (
    <KeyboardAwareScrollView
      bottomOffset={SPACING.l}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      {...props}
    >
      {children}
    </KeyboardAwareScrollView>
  )
}
