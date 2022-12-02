/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

'use strict';

import LoginManager from './LoginManager';
import VoipPushNotification from 'react-native-voip-push-notification';

class PushManager {
  pushToken = '';
  constructor() {
    console.log('Push manager ios');
    VoipPushNotification.addEventListener('register', token => {
      this.pushToken = token;
    });

    // ===== Step 2: subscribe `notification` event =====
    // --- this.onVoipPushNotificationiReceived
    VoipPushNotification.addEventListener('notification', notification => {
      LoginManager.getInstance().pushNotificationReceived(notification);

      // TODO(yulia): check this
      // --- optionally, if you `addCompletionHandler` from the native side, once you have done the js jobs to initiate a call, call `completion()`
      // VoipPushNotification.onVoipNotificationCompleted(notification.uuid);
    });

    // ===== Step 3: subscribe `didLoadWithEvents` event =====
    VoipPushNotification.addEventListener('didLoadWithEvents', events => {
      // --- this will fire when there are events occured before js bridge initialized
      // --- use this event to execute your event handler manually by event type

      if (!events || !Array.isArray(events) || events.length < 1) {
        return;
      }
      for (let voipPushEvent of events) {
        let {name, data} = voipPushEvent;
        if (
          name ===
          VoipPushNotification.RNVoipPushRemoteNotificationsRegisteredEvent
        ) {
          this.pushToken = data;
        } else if (
          name ===
          VoipPushNotification.RNVoipPushRemoteNotificationReceivedEvent
        ) {
          LoginManager.getInstance().pushNotificationReceived(data);
        }
      }
    });

    VoipPushNotification.registerVoipToken();
  }

  init() {
    console.log('PushManager init');
  }

  getPushToken() {
    return this.pushToken;
  }
}

const pushManager = new PushManager();
export default pushManager;
