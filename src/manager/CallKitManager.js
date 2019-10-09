/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import {Voximplant} from 'react-native-voximplant';
import RNCallKeep from 'react-native-callkeep';
import NavigationService from '../routes/NavigationService';
import uuid from 'uuid';
import CallManager from './CallManager';

export default class CallKitManager {
    static myInstance = null;
    callKitUuid = undefined;
    withVideo = false;
    callId = undefined;

    static getInstance() {
        if (this.myInstance === null) {
            this.myInstance = new CallKitManager();
        }
        return this.myInstance;
    }

    constructor() {
        const options = {
            ios: {
                appName: 'VoximplantDemo',
            },
        };
        RNCallKeep.setup(options);

        RNCallKeep.addEventListener('didReceiveStartCallAction', this._onRNCallKeepDidReceiveStartCallAction);
        RNCallKeep.addEventListener('answerCall', this._onRNCallKeepPerformAnswerCallAction);
        RNCallKeep.addEventListener('endCall', this._onRNCallKeepPerformEndCallAction);
        RNCallKeep.addEventListener('didActivateAudioSession', this._onRNCallKeepDidActivateAudioSession);
        RNCallKeep.addEventListener('didDisplayIncomingCall', this._onRNCallKeepDidDisplayIncomingCall);
        RNCallKeep.addEventListener('didPerformSetMutedCallAction', this._onRNCallKeepDidPerformSetMutedCallAction);
    }

    showIncomingCall(isVideoCall, displayName, callId) {
        this.callKitUuid = uuid.v4();
        this.withVideo = isVideoCall;
        this.callId = callId;
        RNCallKeep.displayIncomingCall(this.callKitUuid, displayName, displayName, 'generic', isVideoCall);
    }

    startOutgoingCall(isVideoCall, displayName, callId) {
        this.callKitUuid = uuid.v4();
        this.withVideo = isVideoCall;
        this.callId = callId;
        RNCallKeep.startCall(this.callKitUuid, displayName, displayName, 'generic', isVideoCall);
    }

    reportOutgoingCallConnected() {
        RNCallKeep.reportConnectedOutgoingCallWithUUID(this.callKitUuid);
    }

    endCall() {
        RNCallKeep.endCall(this.callKitUuid);
    }

    _onRNCallKeepDidReceiveStartCallAction = (event) => {
        console.log('CallKitManager: _onRNCallKeepDidReceiveStartCallAction');
        if (!this.callKitUuid) {
            this.callKitUuid = event.callUUID;
        }
    };

    _onRNCallKeepPerformAnswerCallAction = (event) => {
        console.log('CallKitManager: _onRNCallKeepPerformAnswerCallAction' + this.callId);
        if (!this.callKitUuid) {
            this.callKitUuid = event.callUUID;
        }
        Voximplant.Hardware.AudioDeviceManager.getInstance().callKitConfigureAudioSession();
        NavigationService.navigate('Call', {
            callId: this.callId,
            isVideo: this.withVideo,
            isIncoming: true,
        });
    };

    _onRNCallKeepPerformEndCallAction = (event) => {
        console.log('CallKitManager: _onRNCallKeepPerformEndCallAction');
        if (!this.callKitUuid) {
            this.callKitUuid = event.callUUID;
        }
        CallManager.getInstance().endCall();
        Voximplant.Hardware.AudioDeviceManager.getInstance().callKitStopAudio();
        Voximplant.Hardware.AudioDeviceManager.getInstance().callKitReleaseAudioSession();
    };

    _onRNCallKeepDidActivateAudioSession = () => {
        console.log('CallKitManager: _onRNCallKeepDidActivateAudioSession');
        Voximplant.Hardware.AudioDeviceManager.getInstance().callKitStartAudio();
    };

    _onRNCallKeepDidDisplayIncomingCall = (event) => {
        console.log('CallKitManager: _onRNCallKeepDidDisplayIncomingCall');
        this.callKitUuid = event.callUUID;
    };

    _onRNCallKeepDidPerformSetMutedCallAction = (muted, callUUID) => {
        /* You will get this event after the system or the user mutes a call
         * You can use it to toggle the mic on your custom call UI
         */
    };
}
