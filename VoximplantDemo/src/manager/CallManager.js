/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

'use strict';

import {Platform, AppState} from 'react-native';

import PushManager from './PushManager';
import {Voximplant} from 'react-native-voximplant';
import * as RootNavigation from '../routes/routes';
import CallKitManager from './CallKitManager';
import uuid from 'react-native-uuid';
import DeviceInfo from 'react-native-device-info';

// Voximplant SDK supports multiple calls at the same time, however
// this demo app demonstrates only one active call at the moment,
// so it rejects new incoming call if there is already a call.
export default class CallManager {
  static myInstance = null;
  call = null;
  currentAppState = undefined;
  showIncomingCallScreen = false;

  constructor() {
    this.client = Voximplant.getInstance();
    this.currentAppState = AppState.currentState;
    if (Platform.OS === 'ios') {
      DeviceInfo.isEmulator().then(isSimulator => {
        if (!isSimulator) {
          this.callKitManager = CallKitManager.getInstance();
        }
      });
    }
  }

  init() {
    if (Platform.OS === 'ios') {
      DeviceInfo.isEmulator().then(isSimulator => {
        if (!isSimulator) {
          this.callKitManager.init();
        }
      });
    }
    this.client.on(Voximplant.ClientEvents.IncomingCall, this._incomingCall);
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  static getInstance() {
    if (this.myInstance === null) {
      this.myInstance = new CallManager();
    }
    return this.myInstance;
  }

  addCall(call) {
    console.log(`CallManager: addCall: ${call.callId}`);
    this.call = call;
  }

  removeCall(call) {
    console.log(`CallManager: removeCall: ${call.callId}`);
    if (this.call && this.call.callId === call.callId) {
      this.call.off(Voximplant.CallEvents.Connected, this._callConnected);
      this.call.off(Voximplant.CallEvents.Disconnected, this._callDisconnected);
      if (Platform.OS === 'ios' && this.callKitManager) {
        this.callKitManager.endCall(call.callKitUUID);
      }
      this.call = null;
    } else if (this.call) {
      console.warn('CallManager: removeCall: call id mismatch');
    }
  }

  getCallById(callId) {
    if (this.call && callId === this.call.callId) {
      return this.call;
    }
    return null;
  }

  startOutgoingCallViaCallKit(isVideo, number) {
    if (this.callKitManager) {
      this.call.callKitUUID = uuid.v4();
      this.callKitManager.startOutgoingCall(
        isVideo,
        number,
        this.call.callId,
        this.call.callKitUUID,
      );
    }
    this.call.on(Voximplant.CallEvents.Connected, this._callConnected);
    this.call.on(Voximplant.CallEvents.Disconnected, this._callDisconnected);
  }

  endCall(callKitUUID) {
    console.log('CallManager: endCall');
    if (this.call && this.call.callKitUUID === callKitUUID) {
      this.call.hangup();
    }
  }

  async _showIncomingScreenOrNotification(event) {
    if (this.currentAppState !== 'active') {
      await PushManager.showLocalNotification(
        event.call.getEndpoints()[0].displayName,
      );
      this.showIncomingCallScreen = true;
    } else {
      console.log(
        `CallManager: _showIncomingScreenOrNotification: ${event.call.callId}`,
      );
      RootNavigation.navigate('IncomingCall', {
        callId: event.call.callId,
        isVideo: event.video,
        from: event.call.getEndpoints()[0].displayName,
      });
    }
  }

  _incomingCall = event => {
    if (this.call !== null) {
      console.log(
        `CallManager: incomingCall: already have a call, rejecting new call, current call id: ${this.call.callId}`,
      );
      event.call.decline();
      return;
    }
    console.log(`CallManager: _incomingCall: callId: ${event.call.callId}`);
    this.addCall(event.call);
    this.call.on(Voximplant.CallEvents.Disconnected, this._callDisconnected);
    if (Platform.OS === 'ios' && this.callKitManager) {
      if (this.currentAppState === 'active') {
        console.log(
          `CallManager: _incomingCall: report incoming call to CallKit ${event.call.callKitUUID}`,
        );
        this.callKitManager.showIncomingCall(
          event.video,
          event.call.getEndpoints()[0].displayName,
          event.call.callId,
          event.call.callKitUUID,
        );
      } else {
        console.log(
          'CallManager: _incomingCall: application is in the background, incoming call is already reported in AppDelegate',
        );
        this.callKitManager.updateCall(
          event.call.callKitUUID,
          event.call.callId,
        );
      }
    } else {
      this._showIncomingScreenOrNotification(event);
    }
  };

  _callConnected = event => {
    this.call.off(Voximplant.CallEvents.Connected, this._callConnected);
    if (this.callKitManager) {
      this.callKitManager.reportOutgoingCallConnected(event.call.callKitUUID);
    }
  };

  _callDisconnected = event => {
    this.showIncomingCallScreen = false;
    this.removeCall(event.call);
  };

  _handleAppStateChange = newState => {
    console.log(
      `CallManager: _handleAppStateChange: Current app state changed to ${newState}`,
    );
    this.currentAppState = newState;
    if (
      this.currentAppState === 'active' &&
      this.showIncomingCallScreen &&
      this.call !== null
    ) {
      console.log(
        'CallManager: _handleAppStateChange: will navigate to incoming call',
      );
      // this.showIncomingCallScreen = false;
      RootNavigation.navigate('IncomingCall', {
        callId: this.call.callId,
        isVideo: null,
        from: this.call.getEndpoints()[0].displayName,
      });
    }
  };
}
