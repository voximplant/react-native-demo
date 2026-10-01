import { useThemeTokens } from '@/providers/theme'
import { ICONS, type IconName } from './icons'

type Props = { name: IconName; size?: number; color?: string }

export const Icon: React.FC<Props> = ({ name, size = 24, color }) => {
  const theme = useThemeTokens()
  const SvgIcon = ICONS[name]

  return <SvgIcon size={size} color={color ?? theme.colors.icon} />
}
