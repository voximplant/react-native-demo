/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
    AppState
} from 'react-native';

import PushManager from './PushManager';
import { Voximplant } from 'react-native-voximplant';
import NavigationService from '../routes/NavigationService';

// Voximplant SDK supports multiple calls at the same time, however
// this demo app demonstrates only one active call at the moment,
// so it rejects new incoming call if there is already a call. 
export default class CallManager {
    static myInstance = null;
    call = null;
    currentAppState = undefined;
    showIncomingCallScreen = false;

    //Call Settings
    useCallKit = false;

    constructor() {
        this.client = Voximplant.getInstance();
        this.currentAppState = AppState.currentState;
    }

    init() {
        this.client.on(Voximplant.ClientEvents.IncomingCall, this._incomingCall);
        AppState.addEventListener("change", this._handleAppStateChange);
    }

    static getInstance() {
        if (this.myInstance === null) {
            this.myInstance = new CallManager();
        }
        return this.myInstance;
    }

    addCall(call) {
        console.log("CallManager: addCall:" + call.callId);
        this.call = call;

    }

    removeCall(call) {
        console.log("CallManager: removeCall :" + call.callId);
        if (this.call && (this.call.callId === call.callId)) {
            this.call = null;
        } else if (this.call) {
            console.warn("CallManager: removeCall: call id mismatch");
        }
    }

    getCallById(callId) {
        if (callId === this.call.callId) {
            return this.call;
        }
        return null;
    }

    _incomingCall = (event) => {
        if (this.call !== null) {
            console.log("CallManager: incomingCall: already have a call, rejecting new call, current call id " + this.call.callId);
            event.call.decline();
        } else {
            this.addCall(event.call);
            if (this.currentAppState !== 'active') {
                this.call.on(Voximplant.CallEvents.Disconnected, this._callDisconnected);
                PushManager.showLocalNotification('');
                this.showIncomingCallScreen = true;
            } else {
                NavigationService.navigate('IncomingCall', {
                    callId: event.call.callId,
                    isVideo: event.video,
                    from: null
                });
            }
        }
    };

    _callDisconnected = (event) => {
        this.call.off(Voximplant.CallEvents.Disconnected, this._callDisconnected);
        this.removeCall(event.call);
    };

    _handleAppStateChange = (newState) => {
        console.log("CallManager: _handleAppStateChange: Current app state changed to " + newState);
        this.currentAppState = newState;
        if (this.currentAppState === 'active' && this.showIncomingCallScreen && this.call !== null) {
            NavigationService.navigate('IncomingCall', {
                callId: this.call.callId,
                isVideo: null,
                from: null
            });
        }
    };
}