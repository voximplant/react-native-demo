/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import {Voximplant} from 'react-native-voximplant';
import RNCallKit from 'react-native-callkit';
import NavigationService from '../routes/NavigationService';
import uuid from 'uuid';
import CallManager from './CallManager';

export default class CallKitManager {
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

    showIncomingCall(isVideoCall, displayName, callId) {
        this.callKitUuid = uuid.v4();
        this.withVideo = isVideoCall;
        this.callId = callId;
        RNCallKit.displayIncomingCall(this.callKitUuid, displayName, 'generic', isVideoCall);
    }

    startOutgoingCall(isVideoCall, displayName, callId) {
        this.callKitUuid = uuid.v4();
        this.withVideo = isVideoCall;
        this.callId = callId;
        RNCallKit.startCall(this.callKitUuid, displayName, 'number', isVideoCall);
    }

    reportOutgoingCallConnected() {
        RNCallKit.reportConnectedOutgoingCallWithUUID(this.callKitUuid);
    }

    endCall() {
        RNCallKit.endCall(this.callKitUuid);
    }


    _onRNCallKitDidReceiveStartCallAction = (data) => {
        console.log('CallKitManager: _onRNCallKitDidReceiveStartCallAction');
    };

    _onRNCallKitPerformAnswerCallAction = (data) => {
        console.log('CallKitManager: _onRNCallKitPerformAnswerCallAction' + this.callId);
        Voximplant.Hardware.AudioDeviceManager.getInstance().callKitConfigureAudioSession();
        NavigationService.navigate('Call', {
            callId: this.callId,
            isVideo: this.withVideo,
            isIncoming: true,
        });
    };

    _onRNCallKitPerformEndCallAction = (data) => {
        console.log('CallKitManager: _onRNCallKitPerformEndCallAction');
        CallManager.getInstance().endCall();
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
}
