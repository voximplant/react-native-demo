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
  DeviceEventEmitter
} from 'react-native';
import ColorSwitch from './ColorSwitch';
import Button from 'react-native-button';
import { createIconSet } from 'react-native-vector-icons';
var glyphMap = { 
  'speaker': '\uE600',
  'mic-mute': '\uE601',
  'keypad': '\uE602',
  'snd-mute': '\uE603',
  'phone': '\uE604',
  'hangup': '\uE605',
  'flip-camera': '\uE606'
};
if (Platform.OS == "ios") {
  var Icon = createIconSet(glyphMap, 'icomoon');
} else {
  Icon = createIconSet(glyphMap, 'Custom');
}
import ToggleButton from './ToggleButton';
import { Keypad } from './Keypad';
import VoxImplant from "react-native-voximplant";
var update = require('react-addons-update');

/*if (Platform.OS === 'android'){
  var Portal = require('react-native/Libraries/Portal/Portal');
  var tag;
}*/

var	currentCallId,
    uaInstance,
    number = '',
    settings_p2p = false,
    settings_video = false,
    micMuted = false,
    loudSpeaker = false,
    camera = "front";

DeviceEventEmitter.addListener(
  'CallRinging',
  (callId) => {
    console.log('Call ringing');
  }
);

DeviceEventEmitter.addListener(
  'CallConnected',
  (callId) => {
    console.log('Call connected');
    uaInstance.callConnected(callId);
  }
);

DeviceEventEmitter.addListener(
  'CallFailed',
  (callId, code, reason) => {
    console.log('Call failed. Code '+code+' Reason '+reason);
    uaInstance.setModalText('Call failed', 'idle');
  }
);

DeviceEventEmitter.addListener(
  'CallDisconnected',
  (callId) => {
    console.log('Call disconnected');
    uaInstance.callDisconnected(callId);
  }
);

DeviceEventEmitter.addListener(
  'IncomingCall',
  (incomingCall) => {
    console.log('Inbound call');
    currentCallId = incomingCall.callId;
    uaInstance.setModalText('Inbound call from '+incomingCall.from, 'inboundcall');
  }
);

class UserAgent extends React.Component {

  constructor() {
    super();
    this.state = {
      modalText: '',
      isModalOpen: false,
      status: 'idle'
    };
    VoxImplant.SDK.switchToCamera(camera);
  }

  componentDidMount() {
    uaInstance = this;
    this._thisNumber.focus();
  }

  componentWillMount() {
    /*if( Platform.OS === 'android' ) {
      tag = Portal.allocateTag();
    }*/
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.isModalOpen) {
      /*if (Platform.OS === 'android') {
        let modalButtons;

        if (nextState.status == "inboundcall") {
          modalButtons = <View style={styles.modalButtons}>
            <Button onPress={(e) => this.answerCall(e)} style={styles.callbutton}>Answer</Button>
            <Button onPress={(e) => this.rejectCall(e)} style={styles.cancelbutton}>Reject</Button>
          </View>;
        }

        Portal.showModal(tag, 
          <TouchableHighlight onPress={() => this.closeModal()} style={styles.container}>
            <View style={[styles.container, styles.modalBackground]}>
              <View style={[styles.innerContainer, styles.innerContainerTransparent]}>
                <Text>{nextState.modalText}</Text>
                {modalButtons}
              </View>
            </View>
          </TouchableHighlight>);
      }*/
    }
  }

  updateNumber(text) {
    number = text;
    this._thisNumber.setNativeProps({text: text}); 
  }

  onSubmit(event) {    
    this.makeCall();
  }

  makeCall(event) {
    console.log('calling '+number);
    VoxImplant.SDK.createCall(number, settings_video, null, function(callId) {
      currentCallId = callId;      
      if (settings_p2p) VoxImplant.SDK.startCall(callId, {'X-DirectCall' : 'true'});
      else VoxImplant.SDK.startCall(callId);      
      this.setState(update(
        this.state, 
        { 
          $merge: {
            status: 'calling'
          }
        }));
    }.bind(this));
  }

  cancelCall(event) {
    console.log("Cancel call");
    VoxImplant.SDK.disconnectCall(currentCallId);
  }

  answerCall() {
    VoxImplant.SDK.answerCall(currentCallId);
    this.closeModal(true);
  }

  rejectCall() {
    VoxImplant.SDK.declineCall(currentCallId);
    this.closeModal(true);
  }

  callConnected(callId) {
    this.setState(update(
        this.state, 
        { 
          $merge: {
            status: 'connected'
          }
        }));
  }

  callDisconnected(callId) {
    number = '';
    loudSpeaker = false;
    micMuted = false;
    VoxImplant.SDK.setUseLoudspeaker(loudSpeaker);
    VoxImplant.SDK.setMute(micMuted);
    this.setState(update(
        this.state, 
        { 
          $merge: {
            status: 'idle'
          }
        }));
    this.closeModal(true);
  }

  setModalText(text, status) {
    this.setState(update(
        this.state, 
        { 
          $merge: {
            modalText: text,
            status: typeof(status)!='undefined'?status:this.state.status,
            isModalOpen: true   
          }
        }));
  }

  onPressBackdrop() {
    if (this.state.status != 'inboundcall') this.closeModal();
  }

  switchKeypad() {
    if (this.state.status == 'connected') {
      this.setState(update(
        this.state, 
        { 
          $merge: {
            status: 'connected_keypad'
          }
        }));
    } else {
      this.setState(update(
        this.state, 
        { 
          $merge: {
            status: 'connected'
          }
        }));
    }
  }

  switchSpeaker() {
    if (!loudSpeaker) loudSpeaker = true;
    else loudSpeaker = false;
    VoxImplant.SDK.setUseLoudspeaker(loudSpeaker);
  }

  switchMute() {
    if (!micMuted) micMuted = true;
    else micMuted = false;
    VoxImplant.SDK.setMute(micMuted);
  }

  _keypadPressed(value) {
    console.log('Send DTMF '+value+' for call id '+currentCallId);
    VoxImplant.SDK.sendDTMF(currentCallId, value);
  }

  videoSwitch(value) {
    settings_video = value;  
    setTimeout(() => {
      this.forceUpdate();
    }, 200);
  }

  switchCamera() {
    if (camera == "front") {
      VoxImplant.SDK.switchToCamera("back");
      camera = "back";
    } else {
      VoxImplant.SDK.switchToCamera("front");
      camera = "front";
    }
  }

  closeModal(force) {
    /*if (Platform.OS === 'android') {
      Portal.closeModal(tag);
    }*/
    if (this.state.status != 'inboundcall' || force === true) {
      this.setState(update(
        this.state, 
        { 
          $merge: {
            isModalOpen: false,
            status: force===true?this.state.status:'idle'      
          }
        }));
    }
  }

  render() {
    var button, 
        modalButtons = <View style={styles.modalButtons}></View>,
        settingsTable, 
        keypad, 
        videoPanel,
        callingText,
        numberInput,
        flipButton;

    if (settings_video && this.state.status != 'connected_keypad') videoPanel = <View style={styles.videopanel}>
        <VoxImplant.RemoteView style={styles.remotevideo}>
        </VoxImplant.RemoteView>
        <VoxImplant.Preview style={styles.selfview}>
        </VoxImplant.Preview>        
        </View>;

    if (settings_video) flipButton = <View style={{ width: 70, height: 70, marginLeft: 10 }}>
                  <Icon.Button 
                    name="flip-camera" 
                    style={[styles.icon, styles.keypad_icon, {alignSelf: 'center'}]} 
                    size={25} 
                    color="#2B2B2B"
                    backgroundColor="transparent"
                    onPress={() => this.switchCamera()}
                    iconStyle={{marginLeft:9}} />
                </View>;

    if (this.state.status == 'idle') {

        numberInput = <TextInput style={[styles.forminput, styles.numberinput]} onChangeText={(e) => this.updateNumber(e)}
            placeholder="Number to call" initialValue={number} onSubmitEditing={(e) => this.onSubmit(e)}
            ref={component => this._thisNumber = component} 
            autoCapitalize="none"
            autoCorrect={false} />;

        settingsTable = <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <Text style={{alignSelf: 'center', marginTop: 15}}>Settings (will be applied to the next call)</Text>
          <View style={styles.settings_table}>          
            <View style={styles.settings_switch}>     
              <Text style={styles.settings_label}>Peer-to-peer</Text>     
              <ColorSwitch defaultValue={settings_p2p} valueUpdate={(value) => {settings_p2p = value}}/>                       
            </View>        
            <View style={styles.settings_switch}>
              <Text style={styles.settings_label}>Video</Text>
              <ColorSwitch defaultValue={settings_video} valueUpdate={(e) => this.videoSwitch(e)}/> 
            </View>
          </View>
        </View>;

        button =    <View style={{ width: 70, height: 70, alignSelf: 'center' }}>
                    <Icon.Button 
                      name="phone" 
                      style={[styles.icon, styles.phone_icon]} 
                      size={30} 
                      backgroundColor="transparent"
                      onPress={(e) => this.makeCall(e)}
                      iconStyle={{marginLeft:7}} />
                    </View>;

    } else if (this.state.status == 'calling' ||
                this.state.status == 'connected') {

      if (this.state.status == 'calling') callingText = <Text style={styles.callingLabel}>Calling {number}...</Text>;
      else callingText = <Text style={styles.callingLabel}>Connected</Text>;

      button = <View> 
              <View style={{flexDirection: 'row', alignSelf: 'center', marginBottom: 20}}>
                <ToggleButton 
                  onPress={() => this.switchMute()} 
                  name="mic-mute" 
                  style={[styles.icon, styles.keypad_icon]} 
                  size={30} 
                  color="#2B2B2B"
                  pressed={micMuted} />
                <View style={{ width: 70, height: 70, marginHorizontal: 10 }}>
                  <Icon.Button 
                    name="keypad" 
                    style={[styles.icon, styles.keypad_icon, {alignSelf: 'center'}]} 
                    size={25} 
                    color="#2B2B2B"
                    backgroundColor="transparent"
                    onPress={() => this.switchKeypad()}
                    iconStyle={{marginLeft:9}} />
                </View>
                <ToggleButton 
                  onPress={() => this.switchSpeaker()} 
                  name="speaker" 
                  style={[styles.icon, styles.keypad_icon]} 
                  size={30} 
                  color="#2B2B2B" 
                  pressed={loudSpeaker} />
                {flipButton}
              </View>
              <View style={{flexDirection: 'column', alignSelf: 'center'}}>
                <View style={{ width: 70, height: 70 }}>
                  <Icon.Button 
                    name="hangup" 
                    style={[styles.icon, styles.cancel_icon]} 
                    size={12} 
                    color="#FFFFFF" 
                    backgroundColor="transparent"
                    onPress={(e) => this.cancelCall(e)}
                    iconStyle={{marginLeft:9}} />
                </View>
              </View>
              </View>;

    } else if (this.state.status == 'connected_keypad') {     

      button = <View style={{flexDirection: 'row', alignSelf: 'center', alignItems: 'center'}}>                
                <View style={{ width: 70, height: 70 }}>
                  <Icon.Button 
                    name="hangup" 
                    style={[styles.icon, styles.cancel_icon]} 
                    size={12} 
                    color="#FFFFFF"
                    backgroundColor="transparent"
                    onPress={(e) => this.cancelCall(e)}
                    iconStyle={{marginLeft:9}} />
                </View>                
              </View>;

      settingsTable = <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{flex: 1, alignSelf: 'flex-start'}}></Text>
                        <Text onPress={() => this.switchKeypad()} style={styles.hidekeypad}>Hide</Text>
                      </View>;

      if (this.state.status == 'connected_keypad') keypad = <Keypad keyPressed={(e) => this._keypadPressed(e)} />;

    } else if (this.state.status == 'inboundcall') {

      modalButtons = <View style={styles.modalButtons}>
      <Button onPress={(e) => this.answerCall(e)} style={styles.callbutton}>Answer</Button>
      <Button onPress={(e) => this.rejectCall(e)} style={styles.cancelbutton}>Reject</Button>
      </View>;

    } 

    return <View style={styles.useragent}>   
        <View style={{backgroundColor:'#007AFF', height:64, justifyContent: 'flex-end'}}>
          <Text style={{color: '#FFFFFF', alignSelf: 'center', marginBottom: 10}}>Logged in as {this.props.uaDisplayName}</Text>   
        </View>  
        {videoPanel}
        {callingText}      
        {numberInput}   
        {keypad}
        {button}        
        {settingsTable}
         <Modal animationType="fade" transparent={true} visible={this.state.isModalOpen} onRequestClose={() => {}}>
          <TouchableHighlight onPress={() => this.closeModal()} style={styles.container}>
            <View style={[styles.container, styles.modalBackground]}>
              <View style={[styles.innerContainer, styles.innerContainerTransparent]}>
                <Text>{this.state.modalText}</Text>
                {modalButtons}
              </View>
            </View>
          </TouchableHighlight>
        </Modal>
      </View>;
  }

}

var styles = StyleSheet.create({
  container: {
    flex: 1,    
    justifyContent: 'center',
    alignItems: 'stretch'    
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
    borderRadius: 4,
    padding: 5,
    marginBottom: 10,
    height: 40, 
    borderColor: 'gray', 
    borderWidth: 0.5
  },
  button: {
    margin: 15
  },
  buttonText: {
    color: '#007aff',
    fontFamily: '.HelveticaNeueInterface-MediumP4',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  useragent: {
    flex: 1,    
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    flexDirection: 'column'  
  },
  selfview: {
    position: 'relative',
    marginTop: -80,
    left: 110,
    width: 80,
    height: 60,
    borderColor: '#007AFF', 
    borderWidth: 1,
    alignSelf: 'center',
    backgroundColor: '#000000'
  },
  remotevideo: {
    width: 320,
    height: 240,
    borderColor: '#FF1300', 
    borderWidth: 1,
    alignSelf: 'center',
    backgroundColor: '#000000'
  },
  videopanel: {
    marginTop: 10,
    marginBottom: 20
  },
  numberinput: {
    margin: 10
  },
  callingLabel: {
    alignSelf: 'center',
    fontSize: 18,
    marginVertical: 20
  },  
  callbutton: {
    alignSelf: 'center',
    borderColor: '#4CD964',
    borderWidth: 1,
    color: '#4CD964',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10
  },
  cancelbutton: {
    alignSelf: 'center',
    borderColor: '#FF3B30',
    borderWidth: 1,
    color: '#FF3B30',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10
  },
  modalButtons: {
    marginTop: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  settings_switch: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center'
  },
  settings_label: {
    margin: 5
  },
  settings_table: {
    borderTopWidth: 0.5, 
    borderColor: '#000000', 
    marginTop: 15, 
    padding: 10,
    flexDirection: 'row', 
    justifyContent: 'space-around'
  },
  icon: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 35
  },
  phone_icon: {
    width: 70,
    height: 70,
    alignSelf: 'center',
    borderColor: '#4CD964', 
    backgroundColor: '#4CD964',
    marginHorizontal: 10
  },
  keypad_icon: {
    borderColor: '#2B2B2B',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 10,
    borderWidth: 0.5
  },
  cancel_icon: {
    alignSelf: 'center',
    borderColor: '#FF3B30',
    backgroundColor: '#FF3B30'
  },
  hidekeypad: {
    flex: 1, 
    paddingVertical: 15,
    justifyContent: 'center',
    color: '#007aff',
    fontFamily: '.HelveticaNeueInterface-MediumP4',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

export default UserAgent;