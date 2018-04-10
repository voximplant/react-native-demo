/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
    DeviceEventEmitter,
    Platform
} from 'react-native';

import { VoximplantLegacy, Voximplant, Client, Call } from 'react-native-voximplant';
import NavigationService from '../routes/NavigationService';

DeviceEventEmitter.addListener(
    VoximplantLegacy.Events.IncomingCall,
    (incomingCall) => {
        console.log('CallManager: Incoming call:' + incomingCall.callId + ', is video ' + incomingCall.videoCall);
        callManagerGlobal.incomingCall(incomingCall.callId, incomingCall.videoCall, incomingCall.displayName);
    }
);

// Voximplant SDK supports multiple calls at the same time, however
// this demo app demostrates only one active call at the moment, 
// so it rejects new incoming call if there is already a call. 
export default class CallManager {
    static myInstance = null;

    constructor() {
        this.call = null;
        this.currentCallId = null;
        this.client = Voximplant.getClientInstance();
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
        //this.currentCallId = callId;
    }

    removeCall(call) {
        console.log("CallManager: removeCall :" + call.callId);
        if (this.call.callId === call.callId) {
            this.call = null;
        } else {
            console.warn("CallManager: removeCall: call id mismatch");
        }
    }

    // removeCall(callId) {
    //     console.log("CallManager: removeCall:" + callId);
    //     if (this.currentCallId === callId) {
    //         this.currentCallId = null;
    //     } else {
    //         console.warn("CallManager: removeCall: call id mismatch");
    //     }
    // }

    getCallById(callId) {
        if (callId === this.call.callId) {
            return this.call;
        }
        return null;
    }

    incomingCall(callId, isVideoCall, displayName) {
        if (this.currentCallId !== null) {
            console.log("CallManager: incomingCall: already have a call, rejecting new call, current call id " + this.currentCallId);
            VoximplantLegacy.declineCall(callId);
        } else {
            this.addCall(callId);
            NavigationService.navigate('IncomingCall', {
                callId: callId,
                isVideo: isVideoCall,
                from: displayName
            });
        }
    }
}

const callManagerGlobal = CallManager.getInstance();