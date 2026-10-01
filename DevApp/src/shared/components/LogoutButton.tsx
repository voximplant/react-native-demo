import { useLogout } from '../hooks/useLogout'
import { IconButton } from '../ui'

export const LogoutButton = () => {
  const { logout } = useLogout()

  return <IconButton name='leave' onPress={logout} size={28} />
}
