import type { TextStyle, ViewStyle } from 'react-native'
import { TEXT_VARIANT_STYLE } from '../Text'
import type { SizeVariant } from '@/styles/theme'

export const BUTTON_SIZE_STYLES: Record<
  SizeVariant,
  {
    button: ViewStyle
    label: TextStyle
  }
> = {
  sm: {
    button: { paddingVertical: 6, paddingHorizontal: 12 },
    label: {
      ...TEXT_VARIANT_STYLE.body_sm,
      fontWeight: '500'
    }
  },
  md: {
    button: { paddingVertical: 10, paddingHorizontal: 12 },
    label: { ...TEXT_VARIANT_STYLE.body_sm, fontWeight: '500' }
  },
  lg: {
    button: { paddingVertical: 14, paddingHorizontal: 24 },
    label: { ...TEXT_VARIANT_STYLE.body, fontWeight: '500' }
  }
} as const
