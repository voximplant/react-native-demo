/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
    Platform
} from 'react-native';

import LoginManager from './LoginManager';

import firebase from 'react-native-firebase';
import { Notification } from 'react-native-firebase';

class PushManager {
    pushToken = null;

    constructor() { }

    init() {
        try {
            firebase.messaging().onTokenRefresh((token) => {
                console.log('Refresh token: ' + token);
            });
            firebase.messaging().onMessage(async (message) => {
                console.log('PushManager: FCM: notification: ' + message.data);
                LoginManager.getInstance().pushNotificationReceived(message.data);
            });

            firebase.messaging().getToken()
                .then(token => {
                    console.log(token);
                    this.pushToken = token;
                })
                .catch(() => {
                    console.warn('PushManager android: failed to get FCM token');
                });

            const channel = new firebase.notifications.Android.Channel('voximplant_channel_id', 'Incoming call channel', firebase.notifications.Android.Importance.Max)
                .setDescription('Incoming call received');
            firebase.notifications().android.createChannel(channel);
        } catch (e) {
            console.warn('React Native Firebase is not set up. Enable google-services plugin at the bottom of the build.gradle file');
        }

    }

    getPushToken() {
        return this.pushToken;
    }

    showLocalNotification(from) {
        console.log('PushManager: showLocalNotification');
        try {
            const notification = new firebase.notifications.Notification()
                .setNotificationId('notificationId')
                .setTitle('Incoming call');
            notification.android.setSmallIcon('ic_vox_notification');
            notification
                .android.setChannelId('voximplant_channel_id');
            firebase.notifications().displayNotification(notification);
        } catch (e) {
            console.warn('React Native Firebase is not set up. Enable google-services plugin at the bottom of the build.gradle file');
        }

    }

    removeDeliveredNotification() {
        try {
            firebase.notifications().removeAllDeliveredNotifications();
        } catch (e) {
            console.warn('React Native Firebase is not set up. Enable google-services plugin at the bottom of the build.gradle file');
        }
    }
}

const pushManager = new PushManager();
export default pushManager;
