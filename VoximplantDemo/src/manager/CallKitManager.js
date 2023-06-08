/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

'use strict';

import {Voximplant} from 'react-native-voximplant';
import RNCallKeep from 'react-native-callkeep';
import * as RootNavigation from '../routes/routes';
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

    RNCallKeep.addEventListener(
      'didReceiveStartCallAction',
      this._onRNCallKeepDidReceiveStartCallAction,
    );
    RNCallKeep.addEventListener(
      'answerCall',
      this._onRNCallKeepPerformAnswerCallAction,
    );
    RNCallKeep.addEventListener(
      'endCall',
      this._onRNCallKeepPerformEndCallAction,
    );
    RNCallKeep.addEventListener(
      'didActivateAudioSession',
      this._onRNCallKeepDidActivateAudioSession,
    );
    RNCallKeep.addEventListener(
      'didDisplayIncomingCall',
      this._onRNCallKeepDidDisplayIncomingCall,
    );
    RNCallKeep.addEventListener(
      'didPerformSetMutedCallAction',
      this._onRNCallKeepDidPerformSetMutedCallAction,
    );
  }

  showIncomingCall(isVideoCall, displayName, callId, callKitUUID) {
    console.log(
      `CallKitManager: _onRNCallKeepDidReceiveStartCallAction callId: ${callId}, callKitUUID: ${callKitUUID}`,
    );
    this.callKitUuid = callKitUUID;
    this.withVideo = isVideoCall;
    this.callId = callId;
    RNCallKeep.displayIncomingCall(
      this.callKitUuid,
      displayName,
      displayName,
      'generic',
      isVideoCall,
    );
  }

  startOutgoingCall(isVideoCall, displayName, callId, callKitUUID) {
    this.callKitUuid = callKitUUID;
    this.withVideo = isVideoCall;
    this.callId = callId;
    RNCallKeep.startCall(
      this.callKitUuid,
      displayName,
      displayName,
      'generic',
      isVideoCall,
    );
  }

  reportOutgoingCallConnected() {
    RNCallKeep.reportConnectedOutgoingCallWithUUID(this.callKitUuid);
  }

  endCall() {
    if (this.callKitUuid) {
      RNCallKeep.endCall(this.callKitUuid);
      this.callKitUuid = null;
    }
  }

  _onRNCallKeepDidReceiveStartCallAction = event => {
    console.log(
      `CallKitManager: _onRNCallKeepDidReceiveStartCallAction ${JSON.stringify(
        event,
      )}`,
    );
  };

  _onRNCallKeepPerformAnswerCallAction = event => {
    console.log(
      `CallKitManager: _onRNCallKeepPerformAnswerCallAction ${event}`,
    );
    Voximplant.Hardware.AudioDeviceManager.getInstance().callKitConfigureAudioSession();
    RootNavigation.navigate('Call', {
      callId: this.callId,
      isVideo: this.withVideo,
      isIncoming: true,
    });
  };

  _onRNCallKeepPerformEndCallAction = event => {
    console.log(
      `CallKitManager: _onRNCallKeepPerformEndCallAction ${JSON.stringify(
        event,
      )}`,
    );
    CallManager.getInstance().endCall();
    this.callKitUuid = null;
    Voximplant.Hardware.AudioDeviceManager.getInstance().callKitStopAudio();
    Voximplant.Hardware.AudioDeviceManager.getInstance().callKitReleaseAudioSession();
  };

  _onRNCallKeepDidActivateAudioSession = () => {
    console.log('CallKitManager: _onRNCallKeepDidActivateAudioSession');
    Voximplant.Hardware.AudioDeviceManager.getInstance().callKitStartAudio();
  };

  _onRNCallKeepDidDisplayIncomingCall = ({
    error,
    callUUID,
    handle,
    localizedCallerName,
    hasVideo,
    fromPushKit,
    payload,
  }) => {
    console.log(
      `CallKitManager: _onRNCallKeepDidDisplayIncomingCall ${callUUID}`,
    );
  };

  _onRNCallKeepDidPerformSetMutedCallAction = (muted, callUUID) => {
    /* You will get this event after the system or the user mutes a call
     * You can use it to toggle the mic on your custom call UI
     */
  };
}
