/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React, {Component} from 'react';

import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Modal,
  TouchableHighlight,
  TouchableOpacity,
  Platform,
  DeviceEventEmitter,
  Image
} from 'react-native';
import { Keypad } from './Keypad';
import { CallButton } from './CallButton';
import { IncomingCallForm } from './IncomingCallForm';
import { VoximplantLegacy, Preview, RemoteView } from "react-native-voximplant";
import loginManager from './LoginManager';

var	currentCallId,
    uaInstance,
    number = '',
    settings_video = false,
    camera = VoximplantLegacy.CameraType.CameraTypeFront;

DeviceEventEmitter.addListener(
  VoximplantLegacy.Events.CallRinging,
  (callRinging) => {
    console.log('Call ringing. Call id = ' + callRinging.callId);
    if (uaInstance !== undefined) {
      uaInstance.setState({callState: "Ringing"});
    }
  }
);

DeviceEventEmitter.addListener(
  VoximplantLegacy.Events.CallConnected,
  (callConnected) => {
    console.log('Call connected. Call id = ' + callConnected.callId);
    if (uaInstance !== undefined) {
      uaInstance.setState({status: 'connected',
                          callState: "Call is in progress"}); 
    }
  }
);

DeviceEventEmitter.addListener(
  VoximplantLegacy.Events.CallFailed,
  (callFailed) => {
    console.log('Call failed. Code ' + callFailed.code + ' Reason ' + callFailed.reason);
    if (uaInstance !== undefined) {
      uaInstance.setState({modalText: 'Call failed. Reason: ' + callFailed.reason, 
                          status: 'idle', isModalOpen: true});
    }
  }
);

DeviceEventEmitter.addListener(
  VoximplantLegacy.Events.CallDisconnected,
  (callDisconnected) => {
    if (uaInstance !== undefined) {
      console.log('Call disconnected. Call id = ' + callDisconnected.callId);
      uaInstance.callDisconnected(callDisconnected.callId);
    }
  }
);

DeviceEventEmitter.addListener(
  VoximplantLegacy.Events.IncomingCall,
  (incomingCall) => {
    console.log('Incoming call: is video ' + incomingCall.videoCall);
    currentCallId = incomingCall.callId;
    if (uaInstance !== undefined) {
      uaInstance.setState({ status: 'incoming_call', 
                            callState: "Incoming call from " + incomingCall.from,
                            videoEnabled: incomingCall.videoCall,
                            sendVideo: incomingCall.videoCall });
    }
  }
);

export default class UserAgent extends Component {

  constructor() {
    super();
    this.state = {
      status: 'idle',
      callState: "",
      modalText: '',
      isModalOpen: false,
      micMuted: false,
      speakerphoneOn: false,
      videoEnabled: false,
      sendVideo: false,
    };
  }

  componentDidMount() {
    uaInstance = this;
    this._thisNumber.focus();
    if (loginManager.getInstance().incomingCall != undefined) {
      this.setState({ status: 'incoming_call', 
                      callState: "Incoming call from " + loginManager.getInstance().incomingCall.from,
                      videoEnabled: loginManager.getInstance().incomingCall.videoCall,
                      sendVideo: loginManager.getInstance().incomingCall.videoCall});
      loginManager.getInstance().incomingCall = undefined;
    }
    loginManager.getInstance().on("onConnectionClosed", () => this.onConnectionClosed());
  }

  componentWillUnmount() {
    uaInstance = undefined;
  }

  updateNumber(text) {
    number = text;
  }

  onConnectionClosed() {
    if (currentCallId !== undefined && uaInstance !== undefined) {
      this.setState({ 
        status: 'idle',
        callState: ""
       })
       currentCallId = undefined;
    }
  }

  makeCall(isVideoCall) {
    console.log('calling ' + number);
    VoximplantLegacy.createCall(number, isVideoCall, null, function(callId) {
      currentCallId = callId;    
      VoximplantLegacy.startCall(callId);   
      this.setState({ status: 'connecting', 
                      callState: "Calling " + number + "...", 
                      videoEnabled: isVideoCall,
                      sendVideo: isVideoCall });
    }.bind(this));
  }

  cancelCall() {
    console.log("Cancel call");
    VoximplantLegacy.disconnectCall(currentCallId);
  }

  answerCall() {
    VoximplantLegacy.answerCall(currentCallId);
    this.setState({ status: 'connecting', callState: "Call is connecting" });
  }

  rejectCall() {
    VoximplantLegacy.declineCall(currentCallId);
    currentCallId = undefined;
  }

  muteAudio() {
    if (this.state.micMuted) {
      VoximplantLegacy.setMute(false);
      this.setState({ micMuted: false });
    } else {
      VoximplantLegacy.setMute(true);
      this.setState({ micMuted: true });
    }
  }

  switchSpeakerphone() {
    if (this.state.speakerphoneOn) {
      VoximplantLegacy.setUseLoudspeaker(false);
      this.setState({ speakerphoneOn: false });
    } else {
      VoximplantLegacy.setUseLoudspeaker(true);
      this.setState({ speakerphoneOn: true });
    }
  }

  switchKeypad() {
    if (this.state.status === 'connected') {
      this.setState({status: 'connected_keypad'});
    } else {
      this.setState({status: 'connected'});
    }
  }

  _keypadPressed(value) {
    console.log('Send DTMF ' + value + ' for call id ' + currentCallId);
    VoximplantLegacy.sendDTMF(currentCallId, value);
  }


  callDisconnected(callId) {
    this.setState({status: 'idle', micMuted: false, speakerphoneOn: false});
    VoximplantLegacy.setUseLoudspeaker(this.state.speakerphoneOn);
    VoximplantLegacy.setMute(this.state.micMuted);
    currentCallId = undefined;
    // this.closeModal(true);
  }

  removeVideo() {
    this.setState({sendVideo: false});
    VoximplantLegacy.sendVideo(false);
  }

  addVideo() {
    this.setState({videoEnabled: true, sendVideo: true});
    VoximplantLegacy.sendVideo(true);
  }

  logoutClicked() {
    loginManager.getInstance().unregisterPushToken();
    VoximplantLegacy.closeConnection();
  }

  render() {
    var button, 
        keypad, 
        videoPanel,
        callingText,
        incomingCall,
        numberInput,
        callControls,
        flipButton;

    if (this.state.status == 'idle') {
        numberInput = (
          <TextInput 
            style={[ styles.forminput, styles.numberinput ]} 
            onChangeText={(e) => this.updateNumber(e)}
            placeholder="Number to call" 
            defaultValue={number} 
            onSubmitEditing={(e) => this.onSubmit(e)}
            ref={component => this._thisNumber = component} 
            autoCapitalize='none'
            autoCorrect={false} />
        );

        button = (
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', height: 90 }}>
            <CallButton icon_name='call' color='#0C90E7' buttonPressed={ () => this.makeCall(false) } />
            <CallButton icon_name='videocam' color='#0C90E7' buttonPressed={ () => this.makeCall(true) } />
          </View>
        );
    }

    if (this.state.status == 'connecting') {
      callingText = (
        <Text style={ styles.call_connecting_label }>{ this.state.callState }</Text>
      );
      button = (
        <View style={{ height: 90, alignItems: 'center' }}>
          <CallButton icon_name='call-end' color='#FF3B30' buttonPressed={ () => this.cancelCall() } />
        </View>
      );
    }

    if (this.state.status === 'incoming_call') {
      incomingCall = (
        <IncomingCallForm title ={this.state.callState} answerCall={ () => this.answerCall()} rejectCall={ () => this.rejectCall() }/>
      );
    }

    if (this.state.status === 'connected' || this.state.status === 'connected_keypad') {
      callingText = (
        <View style={{alignItems:'center', justifyContent:'center'}}>
          <Text style={ styles.call_connecting_label }>{ this.state.callState }</Text>
        </View>
      );
      callControls = (
          <View style={ styles.call_controls }>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', backgroundColor:'transparent' }}>
              { this.state.micMuted ? (
              <CallButton icon_name='mic' color='#0C90E7' buttonPressed={ () => this.muteAudio() } />
              ) : (
                <CallButton icon_name='mic-off' color='#0C90E7' buttonPressed={ () => this.muteAudio() } />
              )}
              <CallButton icon_name='dialpad' color='#0C90E7' buttonPressed={ () => this.switchKeypad() } />
              { this.state.speakerphoneOn ? (
                <CallButton icon_name='volume-mute' color='#0C90E7' buttonPressed={ () => this.switchSpeakerphone() } />
              ) : (
                <CallButton icon_name='volume-up' color='#0C90E7' buttonPressed={ () => this.switchSpeakerphone() } />
              )}
              { this.state.videoEnabled && this.state.sendVideo ? (
                <CallButton icon_name='videocam-off' color='#0C90E7' buttonPressed={ () => this.removeVideo() } />
              ) : (
                <CallButton icon_name='video-call' color='#0C90E7' buttonPressed={ () => this.addVideo() } />
              )}
              <CallButton icon_name='call-end' color='#FF3B30' buttonPressed={ () => this.cancelCall() } />
              
            </View>
          </View>
      );
      if (this.state.status === 'connected_keypad') {
        keypad = (
          <Keypad keyPressed={ (e) => this._keypadPressed(e) } />
        );
      }
    }

    if (this.state.videoEnabled && (this.state.status === 'connecting' || this.state.status === 'connected')) {
      videoPanel = (
        <View style={styles.videoPanel}>
          <RemoteView style={ styles.remotevideo } callId={ currentCallId } ></RemoteView>
          { this.state.sendVideo ? (
            <Preview style={ styles.selfview }></Preview>
          ) : (
            null
          )}
        </View>
      );
    }

    return (
      <View style={ styles.useragent }>   
        <View style={ styles.toolbar }>
          <TouchableOpacity onPress={ () => this.logoutClicked() }>
            <Text style = {styles.toolbarButton}>
                Logout
            </Text>
          </TouchableOpacity>
          <Text style={ styles.toolbarText }>Logged in as { this.props.uaDisplayName }</Text> 
          <TouchableOpacity>
            <Text style = {styles.toolbarButton}>
                Settings
            </Text>
          </TouchableOpacity>  
        </View> 
          {videoPanel}
          {callingText} 
          {numberInput}
          {button} 
          {incomingCall}
          {keypad}
          {callControls}

        <Modal 
          animationType='fade' 
          transparent={true} 
          visible={this.state.isModalOpen} 
          onRequestClose={() => {}}>
            <TouchableHighlight 
              onPress={ (e) => this.setState({isModalOpen: false, modalText: ''}) } 
              style={ styles.container }>
              <View style={[styles.container, styles.modalBackground]}>
                <View 
                  style={ [styles.innerContainer, styles.innerContainerTransparent] }>
                  <Text>{ this.state.modalText }</Text>
                </View>
              </View>
            </TouchableHighlight>
        </Modal>
      </View>
    );
  }

}

var styles = StyleSheet.create({
  container: {
    flex: 1,    
    justifyContent: 'center',
    alignItems: 'stretch'    
  }, 
  toolbar: {
    backgroundColor: '#0C90E7', 
    paddingTop: 30,
    paddingBottom: 10,
    flexDirection:'row'  
  },
  toolbarText: {
    color: '#FFFFFF', 
    textAlign:'center',
    fontWeight: 'bold',
    flex: 1
  },
  toolbarButton: {
    width: 60, 
    textAlign:'center',
    color: '#FFFFFF',
  },
  modalBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20
  },
  innerContainer: {
    borderRadius: 10,
  },
  innerContainerTransparent: {
    backgroundColor: '#fff', 
    padding: 20
  },
  forminput: {
    padding: 5,
    marginBottom: 10,
    height: 40, 
    ...Platform.select({
      ios: {
        height: 40,
        borderColor: '#0f0f0f',
        borderWidth: 0.5,
        borderRadius: 4,
      }
    })
  },
  useragent: {
    flex: 1,
    flexDirection: 'column',
  },
  selfview: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 100,
    height: 120,
  },
  remotevideo: {
    flex: 1,
  },
  videoPanel: {
    flex: 1,
    position: 'relative'
  },
  call_controls: {
    height: 70,
  },
  numberinput: {
    margin: 10
  },
  call_connecting_label: {
    fontSize: 18,
    alignSelf: 'center'
  },  
});
