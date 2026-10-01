import { joinFormSchema, JOIN_MODES, type JoinFormData, type JoinMode } from './joinForm.schema'

export const isJoinMode = (value: JoinMode | null): value is JoinMode =>
  value !== null && JOIN_MODES.includes(value)

export const isJoinFieldName = (
  name: string | null | undefined
): name is keyof JoinFormData => !!name && name in joinFormSchema.shape
