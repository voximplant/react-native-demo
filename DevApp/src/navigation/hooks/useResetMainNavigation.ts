import { useCallback } from 'react'
import { useMainNavigation } from './useMainNavigation'

export const useResetMainNavigation = () => {
  const navigation = useMainNavigation()

  const reset = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }]
    })
  }, [navigation])

  return reset
}
