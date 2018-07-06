/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';

import LoginManager from './LoginManager';

import FCM, {FCMEvent} from 'react-native-fcm';

class PushManager {
    pushToken = null;

    constructor() { }

    init() {
        FCM.on(FCMEvent.RefreshToken, (token) => {
            console.log("Refresh token: " + token);
        });
        FCM.on(FCMEvent.Notification, async (notif) => {
            console.log("PushManager: FCM: notification: " + notif.voximplant);
            let remoteData = {};
            remoteData.voximplant = notif.voximplant;
            LoginManager.getInstance().pushNotificationReceived(remoteData);
        });

        FCM.getFCMToken().then(token => {
            console.log(token);
            this.pushToken = token;
        });
    }

    getPushToken() {
        return this.pushToken;
    }

    showLocalNotification(from) {
        FCM.presentLocalNotification({
            title: 'Incoming call',
            body: 'from:' + from,
            priority: "high",
            show_in_foreground: false,
            number: 10
        });
    }
}

const pushManager = new PushManager();
export default pushManager;
