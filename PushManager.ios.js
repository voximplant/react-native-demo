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
import NotificationsIOS from 'react-native-notifications';

var pushToken = '';

const pushEventList = [];
let pushManagerInstance = null;

class PushManager {
  constructor() {
    console.log("Push manager ios");
    NotificationsIOS.consumeBackgroundQueue();
    NotificationsIOS.addEventListener('pushKitRegistered', this.onPushKitRegistered.bind(this));
    NotificationsIOS.registerPushKit();
    NotificationsIOS.addEventListener('notificationReceivedBackground', this.onNotificationReceivedBackground.bind(this));
    NotificationsIOS.addEventListener('notificationReceivedForeground', this.onNotificationReceivedForeground.bind(this));
    
  }

  init() {
    console.log("PushManager init");
  }

  onPushKitRegistered(deviceToken) {
    console.log("PushKit Token Received: " + deviceToken);
    pushToken = deviceToken;
  }

  getPushToken() {
    return pushToken;
  }

  pushNotificationReceived(notification) {
    loginManager.getInstance().pushNotificationReceived(notification);
  }

  onNotificationReceivedForeground(notification) {
    console.log("Notification Received Foreground: " + notification.getData());
    loginManager.getInstance().pushNotificationReceived(notification.getData());
  }

  onNotificationReceivedBackground(notification) {
    console.log("Notification Received Background: " + notification.getData());
    loginManager.getInstance().pushNotificationReceived(notification.getData());
  }

  showLocalNotification(from) {
    let localNotification = NotificationsIOS.localNotification({
      alertBody: "from: " + from,
      alertTitle: "Incoming call",
      soundName: "chime.aiff",
      silent: false
    });
  }
}

const pushManager = new PushManager();
export default pushManager;
