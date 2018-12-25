/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import { RemoteMessage } from 'react-native-firebase';
import LoginManager from "./LoginManager";

export default async (message) => {
    console.log("PushBackground android: notification: " + JSON.stringify(message));
    LoginManager.getInstance().pushNotificationReceived(message.data);
    return Promise.resolve();
}