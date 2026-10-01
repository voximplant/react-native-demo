import { AppRegistry } from 'react-native'
import { name as appName } from './app.json'
import App from './src/App'
import { bootstrap } from './src/bootstrap'

bootstrap()
AppRegistry.registerComponent(appName, () => App)
