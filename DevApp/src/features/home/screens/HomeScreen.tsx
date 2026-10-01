import { JoinFormProvider } from '../providers'
import { JoinView } from '../views'

export const HomeScreen = () => {
  return (
    <JoinFormProvider>
      <JoinView />
    </JoinFormProvider>
  )
}
