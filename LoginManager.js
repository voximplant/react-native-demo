/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
  DeviceEventEmitter,
  Platform,
  AppState
} from 'react-native';

import VoxImplant from 'react-native-voximplant';
import DefaultPreference from 'react-native-default-preference';
import PushManager from './PushManager';
import md5 from "react-native-md5";

DeviceEventEmitter.addListener(
  VoxImplant.SDK.Events.ConnectionFailed,
  (connectionFailed) => {
    console.log('Connection failed: reason: ' + connectionFailed.reason);
    loginManagerGlobal.connected = false;
    loginManagerGlobal.emit('onConnectionFailed', connectionFailed.reason);
  }
);

DeviceEventEmitter.addListener(
  VoxImplant.SDK.Events.ConnectionSuccessful,
  () => {
   console.log('Connection successful');
   loginManagerGlobal.connected = true;
   if (loginManagerGlobal.processingPushNotification) {
    DefaultPreference.get('usernameValue').then(
      function(username) {
        DefaultPreference.get('accessToken').then(
          function(accessToken) {
            VoxImplant.SDK.loginUsingAccessToken(username + ".voximplant.com", accessToken);
        });
    });
   } else {
    loginManagerGlobal.emit('onConnected');
   }
  }
);

DeviceEventEmitter.addListener(
  VoxImplant.SDK.Events.ConnectionClosed,
  () => {
    console.log('Connection closed');
    loginManagerGlobal.connected = false;
    loginManagerGlobal.loggedIn = false;
    loginManagerGlobal.emit('onConnectionClosed');
  }
);

DeviceEventEmitter.addListener(
  VoxImplant.SDK.Events.LoginSuccessful,
  (loginSuccessful) => {
    console.log('Login successful ' + loginSuccessful.displayName);
    loginManagerGlobal.displayName = loginSuccessful.displayName;
    loginManagerGlobal.loggedIn = true;
    loginManagerGlobal.processingPushNotification = false;

    // save acceess and refresh token to default preferences to login using
    // access token on push notification, if the connection to Voximplant Cloud
    // is closed
    const loginTokens = loginSuccessful.loginTokens;
    if (loginTokens !== null) {
      DefaultPreference.set('accessToken', loginTokens.accessToken);
      DefaultPreference.set('refreshToken', loginTokens.refreshToken);
      DefaultPreference.set('accessExpire', loginTokens.accessExpire.toString());
      DefaultPreference.set('refreshExpire', loginTokens.refreshExpire.toString());
    } else {
      console.error("LoginSuccessful: login tokens are invalid");
    }
    loginManagerGlobal.registerPushToken();
    loginManagerGlobal.emit('onLoggedIn', loginSuccessful.displayName);
  }
);

DeviceEventEmitter.addListener(
  VoxImplant.SDK.Events.LoginFailed,
  (loginFailed) => {
    console.log('Login failed: error code: ' + loginFailed.errorCode);
    loginManagerGlobal.loggedIn = false;
    loginManagerGlobal.emit('onLoginFailed', loginFailed.errorCode);
  }
);

DeviceEventEmitter.addListener(
  VoxImplant.SDK.Events.IncomingCall,
  (incomingCall) => {
    if (loginManagerGlobal.currentAppState !== "active") {
      console.log('LoginManager: Incoming call: is video ' + incomingCall.videoCall);
      loginManagerGlobal.incomingCall = incomingCall;
      PushManager.showLocalNotification(incomingCall.from);
    }
  }
);

DeviceEventEmitter.addListener(
  VoxImplant.SDK.Events.OneTimeKeyGenerated,
  (oneTimeKeyGenerated) => {
      console.log('LoginManager: OneTimeKeyGenerated: key: ' + oneTimeKeyGenerated.key);
      let hash = md5.hex_md5(oneTimeKeyGenerated.key + "|" 
                      + md5.hex_md5(loginManagerGlobal.myuser + ":voximplant.com:" 
                      + loginManagerGlobal.mypassword));
      loginManagerGlobal.loginWithOneTimeKey(loginManagerGlobal.fullUserName, hash);
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
  fullUserName = '';
  myuser = '';
  mypassword = '';
  incomingCall = undefined;

  static getInstance() {
      if (this.myInstance === null) {
          this.myInstance = new LoginManager();
      }
      return this.myInstance;
  }

  constructor() {
    VoxImplant.SDK.init();
    // Connection to the Voximplant Clound is stayed alive on reloading of the app's 
    // JavaScript code. Calling "closeConnection" API here makes the SDK and app states 
    // synchronized.
    VoxImplant.SDK.closeConnection();
    AppState.addEventListener("change", (...args) => this._handleAppStateChange(...args));
  }

  _handleAppStateChange(newState) {
    console.log("Current app state changed to " + newState);
    this.currentAppState = newState;
  }

  connect(connectivityCheck) {
    VoxImplant.SDK.connect({connectivityCheck})
  }

  loginWithPassword(user, password) {
    VoxImplant.SDK.login(user, password);
  }

  requestOneTimeKey(user, password) {
    this.fullUserName = user;
    this.myuser = user.split('@')[0];
    this.mypassword = password;
    VoxImplant.SDK.requestOneTimeKey(user);
  }

  loginWithOneTimeKey(user, hash) {
    VoxImplant.SDK.loginUsingOneTimeKey(user, hash);
  }

  registerPushToken() {
    VoxImplant.SDK.registerForPushNotifications(PushManager.getPushToken());
  }

  unregisterPushToken() {
    VoxImplant.SDK.unregisterFromPushNotifications(PushManager.getPushToken());
  }

  pushNotificationReceived(notification) {
    // While this flag is true, login is performed via access tokens.
    // This glag will reset to false once logged in.
    this.processingPushNotification = true;
    if (!this.connected) {
      const isConnectivityCheck = false;
      this.connect(isConnectivityCheck);
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
    const handlers = handlersGlobal[event];
    if (handlers) {
      for (const handler of handlers) {
        handler(...args);
      }
    }
  }
}

const loginManagerGlobal = LoginManager.getInstance();