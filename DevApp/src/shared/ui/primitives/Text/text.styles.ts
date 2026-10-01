import { TYPOGRAPHY } from '@/styles/theme'
import { type TextStyle } from 'react-native'
import type { TextVariant } from './text.types'

export interface TextVariantStyle {
  fontSize: number
  fontWeight?: TextStyle['fontWeight']
  lineHeight: number
}

export const TEXT_VARIANT_STYLE: Record<TextVariant, TextVariantStyle> = {
  display: {
    fontSize: TYPOGRAPHY.xxl,
    fontWeight: '500',
    lineHeight: TYPOGRAPHY.lineHeight(TYPOGRAPHY.xxl)
  },
  heading_1: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: '500',
    lineHeight: TYPOGRAPHY.lineHeight(TYPOGRAPHY.xl)
  },
  heading_2: {
    fontSize: TYPOGRAPHY.l,
    fontWeight: '500',
    lineHeight: TYPOGRAPHY.lineHeight(TYPOGRAPHY.l)
  },
  heading_3: {
    fontSize: TYPOGRAPHY.m,
    fontWeight: '500',
    lineHeight: TYPOGRAPHY.lineHeight(TYPOGRAPHY.m, 's')
  },
  body: {
    fontSize: TYPOGRAPHY.l,
    lineHeight: TYPOGRAPHY.lineHeight(TYPOGRAPHY.l)
  },
  body_sm: {
    fontSize: TYPOGRAPHY.m,
    lineHeight: TYPOGRAPHY.lineHeight(TYPOGRAPHY.l, 'l')
  },
  caption: {
    fontSize: TYPOGRAPHY.s,
    lineHeight: TYPOGRAPHY.lineHeight(TYPOGRAPHY.s)
  },
  caption_sm: {
    fontSize: TYPOGRAPHY.xs,
    lineHeight: TYPOGRAPHY.lineHeight(TYPOGRAPHY.xs, 'l')
  },
  code: {
    fontSize: TYPOGRAPHY.s,
    fontWeight: '400',
    lineHeight: TYPOGRAPHY.lineHeight(TYPOGRAPHY.s, 'xl')
  }
} as const
