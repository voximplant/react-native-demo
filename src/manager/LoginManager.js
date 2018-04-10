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

import { VoximplantLegacy, Voximplant, ClientEvents, Client, ClientState } from 'react-native-voximplant';
import DefaultPreference from 'react-native-default-preference';
import PushManager from './PushManager';
import md5 from "react-native-md5";

DeviceEventEmitter.addListener(
    VoximplantLegacy.Events.IncomingCall,
    (incomingCall) => {
        if (loginManagerGlobal.currentAppState !== "active") {
            console.log('LoginManager: Incoming call: is video ' + incomingCall.videoCall);
            loginManagerGlobal.incomingCall = incomingCall;
            PushManager.showLocalNotification(incomingCall.from);
        }
    }
);

const handlersGlobal = {};

export default class LoginManager {

    static myInstance = null;
    client = null;
    processingPushNotification = false;
    displayName = '';
    currentAppState = "inactive";
    fullUserName = '';
    myuser = '';
    username = '';
    password = '';
    incomingCall = undefined;

    static getInstance() {
        if (this.myInstance === null) {
            this.myInstance = new LoginManager();
        }
        return this.myInstance;
    }

    constructor() {
        this.client = Voximplant.getClientInstance();
        // Connection to the Voximplant Clound is stayed alive on reloading of the app's 
        // JavaScript code. Calling "disconnect" API here makes the SDK and app states 
        // synchronized.
        PushManager.init();
        this.client.disconnect();
        AppState.addEventListener("change", (...args) => this._handleAppStateChange(...args));
    }

    loginWithPassword(user, password) {
        this.username = user;
        this.password = password;
        (async() => {
            try {
                let state = await this.client.getClientState();
                if (state === ClientState.DISCONNECTED) {
                    await this.client.connect();
                } 
                let authResult = await this.client.login(user, password);
                this._processLoginSuccess(authResult);
            } catch (e) {
                console.log('LoginManager: loginWithPassword ' + e.name);
                switch (e.name) {
                    case ClientEvents.ConnectionFailed:
                        this._emit('onConnectionFailed', e.message);
                        break;
                    case ClientEvents.AuthResult:
                        this._emit('onLoginFailed', e.code);
                        break;
                }
            }
        })();
    }

    loginWithOneTimeKey(user, password) {
        this.fullUserName = user;
        this.myuser = user.split('@')[0];
        this.password = password;
        (async() => {
            try {
                let state = await this.client.getClientState();
                if (state === ClientState.DISCONNECTED) {
                    await this.client.connect();
                } 
                await this.client.requestOneTimeLoginKey(user);
            } catch (e) {
                console.log('LoginManager: loginWithPassword ' + e.name);
                switch (e.name) {
                    case ClientEvents.ConnectionFailed:
                        this._emit('onConnectionFailed', e.message);
                        break;
                    case ClientEvents.AuthResult:
                        if (e.code === 302) {
                            let hash = md5.hex_md5(e.key + "|"
                                + md5.hex_md5(this.myuser + ":voximplant.com:"
                                    + this.password));
                            try {
                                let authResult = await this.client.loginWithOneTimeKey(this.fullUserName, hash);
                                this._processLoginSuccess(authResult);
                            } catch (e1) {
                                this._emit('onLoginFailed', e1.code);
                            }
                            
                        }
                        break;
                }
            }
            
        })();
    }

    loginWithToken() {
        (async() => {
            try {
                let state = await this.client.getClientState();
                if (state === ClientState.DISCONNECTED) {
                    await this.client.connect();
                } 
                if (state !== ClientState.LOGGED_IN) {
                    const username = await DefaultPreference.get('usernameValue');
                    const accessToken = await DefaultPreference.get('accessToken');
                    console.log('LoginManager: loginWithToken: user: ' + username + ', token: ' + accessToken );
                    const authResult = await this.client.loginWithToken(username + '.voximplant.com', accessToken);
                    this._processLoginSuccess(authResult);
                }
            } catch (e) {
                console.log('LoginManager: loginWithToken: ' + e.name);
                if (e.name === ClientEvents.AuthResult) {
                    console.log('LoginManager: loginWithToken: error code: ' + e.code);
                }
            }
        })();
    }

    logout() {
        (async() => {
            await this.client.disconnect();
            this.unregisterPushToken();
            this._emit('onConnectionClosed');
        })();
    }

    registerPushToken() {
        this.client.registerPushNotificationsToken(PushManager.getPushToken());
    }

    unregisterPushToken() {
        this.client.unregisterPushNotificationsToken(PushManager.getPushToken());
    }

    pushNotificationReceived(notification) {
        // While this flag is true, login is performed via access tokens.
        // This glag will reset to false once logged in.
        this.processingPushNotification = true;
        (async() => {
            await this.loginWithToken();
            this.client.handlePushNotification(notification);
        })();
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

    _emit(event, ...args) {
        const handlers = handlersGlobal[event];
        if (handlers) {
            for (const handler of handlers) {
                handler(...args);
            }
        }
    }

    _handleAppStateChange(newState) {
        console.log("Current app state changed to " + newState);
        this.currentAppState = newState;
    }

    _processLoginSuccess(authResult) {
        this.displayName = authResult.displayName;
        this.processingPushNotification = false;

        // save acceess and refresh token to default preferences to login using
        // access token on push notification, if the connection to Voximplant Cloud
        // is closed
        const loginTokens = authResult.tokens;
        if (loginTokens !== null) {
            DefaultPreference.set('accessToken', loginTokens.accessToken);
            DefaultPreference.set('refreshToken', loginTokens.refreshToken);
            DefaultPreference.set('accessExpire', loginTokens.accessExpire.toString());
            DefaultPreference.set('refreshExpire', loginTokens.refreshExpire.toString());
        } else {
            console.error("LoginSuccessful: login tokens are invalid");
        }
        this.registerPushToken();
        this._emit('onLoggedIn', authResult.displayName);
    }
}

const loginManagerGlobal = LoginManager.getInstance();