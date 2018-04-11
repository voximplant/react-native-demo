/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
    Platform
} from 'react-native';

import { VoximplantLegacy, Voximplant, Client, Call, ClientEvents } from 'react-native-voximplant';
import NavigationService from '../routes/NavigationService';

// Voximplant SDK supports multiple calls at the same time, however
// this demo app demostrates only one active call at the moment, 
// so it rejects new incoming call if there is already a call. 
export default class CallManager {
    static myInstance = null;

    constructor() {
        this.call = null;
        this.client = Voximplant.getClientInstance();
    }

    init() {
        this.client.on(ClientEvents.IncomingCall, (event) => this._incomingCall(event));
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

    _incomingCall(event) {
        if (this.call !== null) {
            console.log("CallManager: incomingCall: already have a call, rejecting new call, current call id " + this.call.callId);
            event.call.decline();
        } else {
            this.addCall(event.call);
            NavigationService.navigate('IncomingCall', {
                callId: event.call.callId,
                isVideo: event.video,
                from: null
            });
        }
    }
}