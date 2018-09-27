/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {Voximplant} from 'react-native-voximplant';
import RNCallKit from 'react-native-callkit';

export default class CallKitManager {

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

    showIncomingCall(uuid, isVideoCall, displayName) {
        RNCallKit.displayIncomingCall(uuid, displayName, 'number', isVideoCall);
    }


    _onRNCallKitDidReceiveStartCallAction(data) {
        /*
         * Your normal start call action
         *
         * ...
         *
         */

        let _uuid = uuid.v4();
        RNCallKit.startCall(_uuid, data.handle);
    }

    _onRNCallKitPerformAnswerCallAction(data) {
        /* You will get this event when the user answer the incoming call
         *
         * Try to do your normal Answering actions here
         *
         * e.g. this.handleAnswerCall(data.callUUID);
         */
    }

    _onRNCallKitPerformEndCallAction(data) {
        /* You will get this event when the user finish the incoming/outgoing call
         *
         * Try to do your normal Hang Up actions here
         *
         * e.g. this.handleHangUpCall(data.callUUID);
         */
    }

    _onRNCallKitDidActivateAudioSession(data) {
        Voximplant.Hardware.AudioDeviceManager.getInstance().callKitStartAudio();
    }

    _onRNCallKitDidDisplayIncomingCall(error) {
        console.log('CallKitManager: _onRNCallKitDidDisplayIncomingCall: error: ' + error);
    }

    _onRNCallKitDidPerformSetMutedCallAction(muted) {
        /* You will get this event after the system or the user mutes a call
         * You can use it to toggle the mic on your custom call UI
         */
    }


    // This is a fake function where you make outgoing calls
    onOutgoingCall() {
        // Store the generated uuid somewhere
        // You will need this when calling RNCallKit.endCall()
        let _uuid = uuid.v4();
        RNCallKit.startCall(_uuid, "886900000000")
    }

    // This is a fake function where you hang up calls
    onHangUpCall() {
        // get the _uuid you stored earlier
        RNCallKit.endCall(_uuid)
    }
}