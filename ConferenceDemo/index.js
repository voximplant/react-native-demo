import {AppRegistry, Platform} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import ForegroundService from './src/Core/Services/ForegroundService';

AppRegistry.registerComponent(appName, () => App);

if (Platform.OS === 'android') {
  AppRegistry.registerHeadlessTask(
    'VIForegroundService',
    () => ForegroundService,
  );
}
