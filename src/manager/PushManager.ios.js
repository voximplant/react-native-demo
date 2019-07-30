/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import LoginManager from './LoginManager';
import NotificationsIOS from 'react-native-notifications';

class PushManager {
    pushToken = '';
    constructor() {
        console.log('Push manager ios');
        NotificationsIOS.addEventListener('pushKitRegistered', this.onPushKitRegistered.bind(this));
        NotificationsIOS.addEventListener('pushKitNotificationReceived', this.pushNotificationReceived.bind(this));
        NotificationsIOS.registerPushKit();
        NotificationsIOS.addEventListener('notificationReceivedBackground', this.onNotificationReceivedBackground.bind(this));
        NotificationsIOS.addEventListener('notificationReceivedForeground', this.onNotificationReceivedForeground.bind(this));
    }

    init() {
        console.log('PushManager init');
    }

    onPushKitRegistered(deviceToken) {
        console.log('PushKit Token Received: ' + deviceToken);
        this.pushToken = deviceToken;
    }

    getPushToken() {
        return this.pushToken;
    }

    pushNotificationReceived(notification) {
        LoginManager.getInstance().pushNotificationReceived(notification._data);
    }

    onNotificationReceivedForeground(notification) {
        console.log('Notification Received Foreground: ' + notification.getData());
        LoginManager.getInstance().pushNotificationReceived(notification.getData());
    }

    onNotificationReceivedBackground(notification) {
        console.log('Notification Received Background: ' + notification.getData());
        LoginManager.getInstance().pushNotificationReceived(notification.getData());
    }

    showLocalNotification(from) {
        NotificationsIOS.localNotification({
            body: 'from: ' + from,
            title: 'Incoming call',
            sound: 'chime.aiff',
            silent: false,
        });
    }
}

const pushManager = new PushManager();
export default pushManager;
