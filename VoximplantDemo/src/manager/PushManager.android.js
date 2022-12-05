/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

'use strict';

import LoginManager from './LoginManager';

import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';

class PushManager {
  pushToken = null;

  constructor() {}

  init() {
    try {
      // Register background handler
      messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log(
          `PushManager(android): background notification: ${JSON.stringify(
            remoteMessage,
          )}`,
        );
        LoginManager.getInstance().pushNotificationReceived(remoteMessage.data);
        return Promise.resolve();
      });

      messaging().onTokenRefresh(token => {
        console.log(`PushManager(android): Refresh token: ${token}`);
        this.pushToken = token;
      });

      messaging().onMessage(remoteMessage => {
        console.log(
          `PushManager(android): onMessage: ${JSON.stringify(
            remoteMessage.data,
          )}`,
        );
        LoginManager.getInstance().pushNotificationReceived(remoteMessage.data);
      });

      messaging()
        .getToken()
        .then(token => {
          this.pushToken = token;
        })
        .catch(error => {
          console.log(
            `PushManager(android): failed to get FCM token: ${error}`,
          );
        });
    } catch (e) {
      console.warn(
        'React Native Firebase is not set up. Enable google-services plugin at the bottom of the build.gradle file',
      );
    }
  }

  getPushToken() {
    return this.pushToken;
  }

  async showLocalNotification(from) {
    console.log('PushManager: showLocalNotification');
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Incoming calls',
      importance: AndroidImportance.HIGH,
    });

    await notifee.displayNotification({
      title: 'Incoming Call',
      body: `${from} is calling`,
      android: {
        channelId,
        smallIcon: 'ic_vox_notification',
        pressAction: {
          id: 'incoming_call',
          launchActivity: 'default',
        },
      },
    });
  }
}

const pushManager = new PushManager();
export default pushManager;
