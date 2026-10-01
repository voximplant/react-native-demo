import { useContext, type Context } from 'react'

export const useStrictContext = <T>(context: Context<T | null>, name: string): T => {
  const ctx = useContext(context)
  if (ctx === null)
    throw new Error(`${name} must be used within its Provider`)
  return ctx
}
