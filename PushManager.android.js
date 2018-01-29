/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

 'use strict';

import React from 'react';
import {
  Platform
} from 'react-native';

import loginManager from './LoginManager';
import VoxImplant from 'react-native-voximplant';

import FCM, {FCMEvent} from 'react-native-fcm';

FCM.on(FCMEvent.Notification, async (notif) => {
    var remoteData = {};
    remoteData.voximplant = notif.voximplant;
    pushManager.pushNotificationReceived(remoteData);
});

FCM.on(FCMEvent.RefreshToken, (token) => {
    console.log("Refresh token: " + token);
});

var pushToken = '';

const pushEventList = [];
let pushManagerInstance = null;

class PushManager {
  constructor() {

  }

  init() {
    console.log("PushManager init");
    if (Platform.OS === 'android') {
        FCM.getFCMToken().then(token => {
            console.log(token)
            pushToken = token;
        });
    }
  }

  getPushToken() {
    return pushToken;
  }

  pushNotificationReceived(notification) {
    loginManager.getInstance().pushNotificationReceived(notification);
  }

  showLocalNotification(from) {
    FCM.presentLocalNotification({
      title: 'Incoming call',
      body: 'from: ' + from,
      priority: "high",
      show_in_foreground: false,
      number: 10
    });
  }
}

const pushManager = new PushManager();
export default pushManager;
