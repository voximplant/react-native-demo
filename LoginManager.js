'use strict';

import React from 'react';
import {
  DeviceEventEmitter,
  Platform,
  AppState
} from 'react-native';

import VoxImplant from 'react-native-voximplant';
import DefaultPreference from 'react-native-default-preference';
import pushManager from './PushManager'

DeviceEventEmitter.addListener(
  VoxImplant.SDK.Events.ConnectionFailed,
  (connectionFailed) => {
    console.log('Connection failed: reason: ' + connectionFailed.reason);
    LoginManager.getInstance().connected = false;
    LoginManager.getInstance().emit('onConnectionFailed', connectionFailed.reason);
  }
);

DeviceEventEmitter.addListener(
  VoxImplant.SDK.Events.ConnectionSuccessful,
  () => {
   console.log('Connection successful');
   LoginManager.getInstance().connected = true;
   LoginManager.getInstance().emit('onConnected');
  }
);

DeviceEventEmitter.addListener(
  VoxImplant.SDK.Events.ConnectionClosed,
  () => {
   console.log('Connection closed');
   LoginManager.getInstance().connected = false;
   LoginManager.getInstance().emit('onConnectionClosed');
  }
);

DeviceEventEmitter.addListener(
  VoxImplant.SDK.Events.LoginSuccessful,
  (loginSuccessful) => {
    console.log('Login successful ' + loginSuccessful.displayName);
    LoginManager.getInstance().displayName = loginSuccessful.displayName;
    LoginManager.getInstance().loggedIn = true;
    LoginManager.getInstance().processingPushNotification = false;
    DefaultPreference.set('accessToken', loginSuccessful.accessToken);
    DefaultPreference.set('refreshToken', loginSuccessful.refreshToken);
    DefaultPreference.set('accessExpire', loginSuccessful.accessExpire.toString());
    DefaultPreference.set('refreshExpire', loginSuccessful.refreshExpire.toString());
    LoginManager.getInstance().registerPushToken();
    LoginManager.getInstance().emit('onLoggedIn', LoginManager.getInstance().displayName);
  }
);

DeviceEventEmitter.addListener(
  VoxImplant.SDK.Events.LoginFailed,
  (loginFailed) => {
    console.log('Login failed: error code: ' + loginFailed.errorCode);
    LoginManager.getInstance().loggedIn = false;
    LoginManager.getInstance().emit('onLoginFailed', loginFailed.errorCode);
  }
);

DeviceEventEmitter.addListener(
  VoxImplant.SDK.Events.IncomingCall,
  (incomingCall) => {
    if (LoginManager.getInstance().currentAppState != "active") {
      console.log('LoginManager: Incoming call: is video ' + incomingCall.videoCall);
      LoginManager.getInstance().incomingCall = incomingCall;
      pushManager.showLocalNotification(incomingCall.from);
    }
  }
);

const handlersGlobal = {};

export default class LoginManager {

  static myInstance = null;
  connected = false;
  loggedIn = false;
  processingPushNotification = false;
  displayName = '';
  currentAppState = "inactive";
  incomingCall = undefined;

  static getInstance() {
      if (this.myInstance == null) {
          this.myInstance = new LoginManager();
      }
      return this.myInstance;
  }

  constructor() {
    VoxImplant.SDK.init();
    VoxImplant.SDK.closeConnection();
    AppState.addEventListener("change", this.handleAppStateChange);
  }

  connect(connectCheck) {
    VoxImplant.SDK.connect({connectivityCheck: connectCheck})
  }

  loginWithPassword(user, password) {
    VoxImplant.SDK.login(user, password);
  }

  handleAppStateChange = newState => {
    console.log("Current app state changed to " + newState);
    this.currentAppState = newState;
  };

  registerPushToken() {
    VoxImplant.SDK.registerForPushNotifications(pushManager.getPushToken());
  }

  unregisterPushToken() {
    VoxImplant.SDK.unregisterFromPushNotifications(pushManager.getPushToken());
  }

  pushNotificationReceived(notification) {
    this.processingPushNotification = true;
    if (!this.connected) {
      this.connect(false);
    } else if (!this.loggedIn) {
      DefaultPreference.get('usernameValue').then(
        function(username) {
          DefaultPreference.get('accessToken').then(
            function(accessToken) {
              VoxImplant.SDK.loginUsingAccessToken(username + ".voximplant.com", accessToken);
          });
      });
    }
    VoxImplant.SDK.handlePushNotification(notification);
  }

  on(event, handler) {
    if (!handlersGlobal[event]) handlersGlobal[event] = [];
    handlersGlobal[event].push(handler);
  }

  off(event, handler) {
    if (handlersGlobal[event]) {
      handlersGlobal[event] = handlersGlobal[event].filter(v => v !== handler);
    }
  }

  emit(event, ...args) {
    if (event === 'onConnected' && this.processingPushNotification) {
      DefaultPreference.get('usernameValue').then(
        function(username) {
          DefaultPreference.get('accessToken').then(
            function(accessToken) {
              VoxImplant.SDK.loginUsingAccessToken(username + ".voximplant.com", accessToken);
          });
      });
    } else {
      const handlers = handlersGlobal[event];
      if (handlers) {
        for (const handler of handlers) {
          handler(...args);
        }
      }
    }
  }
}
