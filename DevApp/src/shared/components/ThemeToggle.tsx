import { useTheme } from '@/providers/theme'
import { IconButton } from '@/shared/ui'

export const ThemeToggle = () => {
  const isDark = useTheme((s) => s.isDark)
  const toggleTheme = useTheme((s) => s.toggleTheme)

  return (
    <IconButton
      name={isDark ? 'sun' : 'moon'}
      onPress={toggleTheme}
      size={28}
    />
  )
}
