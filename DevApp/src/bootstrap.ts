import { sdkService } from './services/sdk'

export const bootstrap = () => {
  sdkService.init()
}
