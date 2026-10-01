import { logger } from '@/utils'
import { useNavigation, usePreventRemove } from '@react-navigation/native'

export const usePreventBackNavigation = () => {
  const navigation = useNavigation()

  usePreventRemove(true, ({ data }) => {
    // system back gesture
    if (data.action.type === 'GO_BACK') {
      logger.info('usePreventBackNavigation', 'prevent screen exit', { data })
      return
    }

    navigation.dispatch(data.action)
  })
}
