/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import { AppRegistry, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import PushBackground from './src/manager/PushBackground'

AppRegistry.registerComponent(appName, () => App);

if (Platform.OS === 'android') {
    AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => PushBackground);
}
