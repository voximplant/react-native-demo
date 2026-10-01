import { useAuth } from '@/providers/auth'
import { useGlobalLoading } from '@/providers/globalLoading'

export const useLogout = () => {
  const authLogout = useAuth((s) => s.logout)
  const setGlobalLoading = useGlobalLoading((s) => s.setLoading)

  const logout = async () => {
    setGlobalLoading(true)
    try {
      await authLogout()
    } finally {
      setGlobalLoading(false)
    }
  }

  return { logout }
}
