/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {Voximplant} from 'react-native-voximplant';
import RNCallKit from 'react-native-callkit';
import NavigationService from "../routes/NavigationService";
import CallManager from "./CallManager";

export default class CallKitManager {
    // static myInstance = null;
    callKitUuid = undefined;
    withVideo = false;
    callId = undefined;

    constructor() {
        let options = {
            appName: 'VoximplantDemo',
        };
        try {
            RNCallKit.setup(options);
        } catch (err) {
            console.log('CallKitManager: CallKit setup error:', err.message);
        }

        RNCallKit.addEventListener('didReceiveStartCallAction', this._onRNCallKitDidReceiveStartCallAction);
        RNCallKit.addEventListener('answerCall', this._onRNCallKitPerformAnswerCallAction);
        RNCallKit.addEventListener('endCall', this._onRNCallKitPerformEndCallAction);
        RNCallKit.addEventListener('didActivateAudioSession', this._onRNCallKitDidActivateAudioSession);
        RNCallKit.addEventListener('didDisplayIncomingCall', this._onRNCallKitDidDisplayIncomingCall);
        RNCallKit.addEventListener('didPerformSetMutedCallAction', this._onRNCallKitDidPerformSetMutedCallAction);
    }

    showIncomingCall(uuid, isVideoCall, displayName, callId) {
        this.callKitUuid = uuid;
        this.withVideo = isVideoCall;
        this.callId = callId;
        RNCallKit.displayIncomingCall(uuid, displayName, 'number', isVideoCall);
    }

    endCall() {
        RNCallKit.endCall(this.callKitUuid);
    }


    _onRNCallKitDidReceiveStartCallAction = (data) => {
        /*
         * Your normal start call action
         *
         * ...
         *
         */

        // let _uuid = uuid.v4();
        // RNCallKit.startCall(_uuid, data.handle);
    };

    _onRNCallKitPerformAnswerCallAction = (data) => {
        console.log('CallKitManager: _onRNCallKitPerformAnswerCallAction' + this.callId);
        Voximplant.Hardware.AudioDeviceManager.getInstance().callKitConfigureAudioSession();
        NavigationService.navigate('Call', {
            callId: this.callId,
            isVideo: this.withVideo,
            isIncoming: true
        });
    };

    _onRNCallKitPerformEndCallAction = (data) => {
        console.log('CallKitManager: _onRNCallKitPerformEndCallAction');
        Voximplant.Hardware.AudioDeviceManager.getInstance().callKitStopAudio();
        Voximplant.Hardware.AudioDeviceManager.getInstance().callKitReleaseAudioSession();
    };

    _onRNCallKitDidActivateAudioSession = (data) => {
        console.log('CallKitManager: _onRNCallKitDidActivateAudioSession');
        Voximplant.Hardware.AudioDeviceManager.getInstance().callKitStartAudio();
    };

    _onRNCallKitDidDisplayIncomingCall = (error) => {
        console.log('CallKitManager: _onRNCallKitDidDisplayIncomingCall: error: ' + error);
    };

    _onRNCallKitDidPerformSetMutedCallAction = (muted) => {
        /* You will get this event after the system or the user mutes a call
         * You can use it to toggle the mic on your custom call UI
         */
    };


    // This is a fake function where you make outgoing calls
    onOutgoingCall() {
        // Store the generated uuid somewhere
        // You will need this when calling RNCallKit.endCall()
        let _uuid = uuid.v4();
        RNCallKit.startCall(_uuid, "886900000000")
    }
}