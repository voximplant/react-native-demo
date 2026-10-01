import { useTheme } from '@/providers/theme'
import { StatusBar as RNStatusBar } from 'react-native'

export const StatusBar = () => {
  const isDark = useTheme((s) => s.isDark)

  return <RNStatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
}
