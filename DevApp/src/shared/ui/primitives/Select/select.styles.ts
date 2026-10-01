import { SHAPE, SPACING } from '@/styles/theme'
import { StyleSheet } from 'react-native'
import { TEXT_VARIANT_STYLE } from '../Text'

export const selectStyles = StyleSheet.create({
  container: {},
  label: {
    ...TEXT_VARIANT_STYLE.body,
    marginBottom: SPACING.labelGap
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: TEXT_VARIANT_STYLE.caption.lineHeight + SPACING.labelGap,
    borderRadius: SHAPE.borderRadius.s,
    height: TEXT_VARIANT_STYLE.body.lineHeight + SPACING.inputPaddingV * 2,
    paddingVertical: 0,
    paddingHorizontal: SPACING.inputPaddingH
  },
  input: {
    ...TEXT_VARIANT_STYLE.body,
    flex: 1,
    padding: 0,
    textAlignVertical: 'center'
  },
  caption: {
    ...TEXT_VARIANT_STYLE.caption,
    position: 'absolute',
    bottom: 0
  }
})
