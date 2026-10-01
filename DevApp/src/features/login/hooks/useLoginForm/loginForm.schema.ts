import type { AuthData } from '@/providers/auth'
import { ConnectionNode } from '@voximplant/react-native-core'
import z from 'zod'

export type LoginFormData = Omit<AuthData, 'gateway'> & {
  gateway?: string
}

export const loginfFormSchema = z.toZod<LoginFormData>()(
  z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
    node: z.enum(ConnectionNode, 'Node is required').nullable(),
    gateway: z.string().optional()
  })
)
