import { loginfFormSchema, type LoginFormData } from './loginForm.schema'

export const isLoginFieldName = (
  name: string | null | undefined
): name is keyof LoginFormData => !!name && name in loginfFormSchema.shape
