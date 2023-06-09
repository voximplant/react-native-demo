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
  // Voximplant call id and CallKit callUUID map, where CallKit callUUID is the key
  callsMap = {};
  withVideo = false;

  static getInstance() {
    if (this.myInstance === null) {
      this.myInstance = new CallKitManager();
    }
    return this.myInstance;
  }
  init() {
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
    let callUUID = callKitUUID.toUpperCase();
    console.log(
      `CallKitManager: showIncomingCall callId: ${callId}, callKitUUID: ${callUUID}`,
    );
    this.callsMap[callUUID] = callId;
    this.withVideo = isVideoCall;
    RNCallKeep.displayIncomingCall(
      callUUID,
      displayName,
      displayName,
      'generic',
      isVideoCall,
    );
  }

  startOutgoingCall(isVideoCall, displayName, callId, callKitUUID) {
    let callUUID = callKitUUID.toUpperCase();
    this.callsMap[callUUID] = callId;
    this.withVideo = isVideoCall;
    RNCallKeep.startCall(
      callUUID,
      displayName,
      displayName,
      'generic',
      isVideoCall,
    );
  }

  reportOutgoingCallConnected(callKitUUID) {
    let callUUID = callKitUUID.toUpperCase();
    RNCallKeep.reportConnectedOutgoingCallWithUUID(callUUID);
  }

  endCall(callKitUUID) {
    let callUUID = callKitUUID.toUpperCase();
    console.log(`CallKitManager: endCall: ${callUUID}`);
    if (callUUID) {
      delete this.callsMap[callUUID];
      RNCallKeep.endCall(callUUID);
    }
  }

  _onRNCallKeepDidReceiveStartCallAction = event => {
    console.log(
      `CallKitManager: _onRNCallKeepDidReceiveStartCallAction ${JSON.stringify(
        event,
      )}`,
    );
  };

  _onRNCallKeepPerformAnswerCallAction = ({callUUID}) => {
    let callUUID_ = callUUID.toUpperCase();
    console.log(
      `CallKitManager: _onRNCallKeepPerformAnswerCallAction ${callUUID_}`,
    );
    Voximplant.Hardware.AudioDeviceManager.getInstance().callKitConfigureAudioSession();
    let callId = this.callsMap[callUUID_];
    RootNavigation.navigate('Call', {
      callId: callId,
      isVideo: this.withVideo,
      isIncoming: true,
    });
  };

  _onRNCallKeepPerformEndCallAction = ({callUUID}) => {
    let callUUID_ = callUUID.toUpperCase();
    console.log(
      `CallKitManager: _onRNCallKeepPerformEndCallAction ${callUUID_}`,
    );
    CallManager.getInstance().endCall(callUUID_);
    delete this.callsMap[callUUID_];
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
    let callUUID_ = callUUID.toUpperCase();
    if (!this.callsMap[callUUID_]) {
      this.callsMap[callUUID_] = '';
      this.withVideo = hasVideo;
    }
  };

  _onRNCallKeepDidPerformSetMutedCallAction = (muted, callUUID) => {
    /* You will get this event after the system or the user mutes a call
     * You can use it to toggle the mic on your custom call UI
     */
  };
}
