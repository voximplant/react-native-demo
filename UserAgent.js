'use strict';

var React = require('react-native');
var Modal = require('react-native-modal');
var ColorSwitch = require('./ColorSwitch');
var Button = require('react-native-button');
var { createIconSet } = require('react-native-vector-icons');
var glyphMap = { 
  'speaker': '\uE600',
  'mic-mute': '\uE601',
  'keypad': '\uE602',
  'snd-mute': '\uE603',
  'phone': '\uE604',
  'hangup': '\uE605' 
};
var Icon = createIconSet(glyphMap, 'icomoon');
var RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');
var ToggleButton = require('./ToggleButton');
var Keypad = require('./Keypad').Keypad;
var VoxImplant = require("react-native-voximplant");

var {
  Text,
  View,
  StyleSheet,
  TextInput
} = React;

var	currentCallId,
	uaInstance,
	number = '',
	settings_p2p = false,
    settings_video = false,
    micMuted = false,
    loudSpeaker = false;

RCTDeviceEventEmitter.addListener(
  'CallRinging',
  (callId) => {
    console.log('Call ringing');
  }
);

RCTDeviceEventEmitter.addListener(
  'CallConnected',
  (callId) => {
    console.log('Call connected');
    uaInstance.callConnected(callId);
  }
);

RCTDeviceEventEmitter.addListener(
  'CallFailed',
  (callId, code, reason) => {
    console.log('Call failed. Code '+code+' Reason '+reason);
    uaInstance.setModalText('Call failed', 'idle');
    uaInstance.openModal();
  }
);

RCTDeviceEventEmitter.addListener(
  'CallDisconnected',
  (callId) => {
    console.log('Call disconnected');
    uaInstance.callDisconnected(callId);
  }
);

RCTDeviceEventEmitter.addListener(
  'IncomingCall',
  (incomingCall) => {
    console.log('Inbound call');
    currentCallId = incomingCall.callId;
    uaInstance.setModalText('Inbound call from '+incomingCall.from, 'inboundcall');
    uaInstance.openModal();
  }
);

var UserAgent = React.createClass({

  mixins: [Modal.Mixin],

  getInitialState: function() {
    return {
      modalText: '',
      status: 'idle'
    };
  },

  componentDidMount: function() {
    uaInstance = this;
    this._thisNumber.focus();
  },

  updateNumber: function(text) {
    number = text;
    this._thisNumber.setNativeProps({text: text}); 
  },

  onSubmit: function(event) {    
    this.makeCall();
  },

  makeCall: function(event) {
    console.log('calling '+number);
    VoxImplant.SDK.createCall(number, settings_video, null, function(callId) {
      currentCallId = callId;      
      if (settings_p2p) VoxImplant.SDK.startCall(callId, {'X-DirectCall' : 'true'});
      else VoxImplant.SDK.startCall(callId);      
      this.setState(React.addons.update(
        this.state, 
        { 
          $merge: {
            status: 'calling'
          }
        }));
    }.bind(this));
  },

  cancelCall: function(event) {
    VoxImplant.SDK.disconnectCall(currentCallId);
  },

  answerCall: function() {
    VoxImplant.SDK.answerCall(currentCallId);
    this.closeModal();
  },

  rejectCall: function() {
    VoxImplant.SDK.declineCall(currentCallId);
    this.closeModal();
  },

  callConnected: function(callId) {
    this.setState(React.addons.update(
        this.state, 
        { 
          $merge: {
            status: 'connected'
          }
        }));
  },

  callDisconnected: function(callId) {
    this.setState(React.addons.update(
        this.state, 
        { 
          $merge: {
            status: 'idle'
          }
        }));
  },

  setModalText: function(text, status) {
    this.setState(React.addons.update(
        this.state, 
        { 
          $merge: {
            modalText: text,
            status: typeof(status)!='undefined'?status:this.state.status
          }
        }));
  },

  onPressBackdrop: function() {
    if (this.state.status != 'inboundcall') this.closeModal();
  },

  switchKeypad: function() {
    if (this.state.status == 'connected') {
      this.setState(React.addons.update(
        this.state, 
        { 
          $merge: {
            status: 'connected_keypad'
          }
        }));
    } else {
      this.setState(React.addons.update(
        this.state, 
        { 
          $merge: {
            status: 'connected'
          }
        }));
    }
  },

  switchSpeaker: function() {
    if (!loudSpeaker) loudSpeaker = true;
    else loudSpeaker = false;
    VoxImplant.SDK.setUseLoudspeaker(loudSpeaker);
  },

  switchMute: function() {
    if (!micMuted) micMuted = true;
    else micMuted = false;
    VoxImplant.SDK.setMute(micMuted);
  },

  _keypadPressed: function(value) {
    console.log('Send DTMF '+value+' for call id '+currentCallId);
    VoxImplant.SDK.sendDTMF(currentCallId, value);
  },

  videoSwitch: function(value) {
    settings_video = value;  
    setTimeout(() => {
      this.forceUpdate();
    }, 200);
  },

  render: function() {
    var button, 
        modalButtons = <View style={styles.modalButtons}></View>,
        settingsTable, 
        keypad, 
        videoPanel,
        callingText,
        numberInput;

    if (settings_video && this.state.status != 'connected_keypad') videoPanel = <View style={styles.videopanel}>
        <VoxImplant.RemoteView style={styles.remotevideo}>
        </VoxImplant.RemoteView>
        <VoxImplant.Preview style={styles.selfview}>
        </VoxImplant.Preview>        
        </View>;

    if (this.state.status == 'idle') {

        numberInput = <TextInput style={[styles.forminput, styles.numberinput]} onChangeText={this.updateNumber}
            placeholder="Number to call" initialValue={number} onSubmitEditing={this.onSubmit}
            ref={component => this._thisNumber = component} />;

        settingsTable = <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <Text style={{alignSelf: 'center', marginTop: 15}}>Settings (will be applied to the next call)</Text>
          <View style={styles.settings_table}>          
            <View style={styles.settings_switch}>     
              <Text style={styles.settings_label}>Peer-to-peer</Text>     
              <ColorSwitch defaultValue={settings_p2p} valueUpdate={(value) => {settings_p2p = value}}/>                       
            </View>        
            <View style={styles.settings_switch}>
              <Text style={styles.settings_label}>Video</Text>
              <ColorSwitch defaultValue={settings_video} valueUpdate={this.videoSwitch}/> 
            </View>
          </View>
        </View>;

        button = <Button onPress={this.makeCall}>
                  <Icon name="phone" style={[styles.icon, styles.phone_icon]} size={30} color="#FFFFFF" />
                  </Button>;

    } else if (this.state.status == 'calling' ||
                this.state.status == 'connected') {

      if (this.state.status == 'calling') callingText = <Text style={styles.callingLabel}>Calling {number}...</Text>;
      else callingText = <Text style={styles.callingLabel}>Connected</Text>;

      button = <View> 
              <View style={{flexDirection: 'row', alignSelf: 'center', marginBottom: 20}}>
                <ToggleButton onPress={this.switchMute} name="mic-mute" style={[styles.icon, styles.keypad_icon]} size={30} color="#2B2B2B" />
                <Button onPress={this.switchKeypad}>
                  <Icon name="keypad" style={[styles.icon, styles.keypad_icon]} size={25} color="#2B2B2B" />
                </Button>
                <ToggleButton onPress={this.switchSpeaker} name="speaker" style={[styles.icon, styles.keypad_icon]} size={30} color="#2B2B2B" />
              </View>
              <View style={{flexDirection: 'column', alignSelf: 'center'}}>
                <Button onPress={this.cancelCall}>
                  <Icon name="hangup" style={[styles.icon, styles.cancel_icon]} size={12} color="#FFFFFF" />
                </Button>
              </View>
              </View>;

    } else if (this.state.status == 'connected_keypad') {

      //callingText = <Text style={styles.callingLabel}>Connected</Text>;      

      button = <View style={{flexDirection: 'row', alignSelf: 'center', alignItems: 'center'}}>                
                <Button onPress={this.cancelCall}>
                  <Icon name="hangup" style={[styles.icon, styles.cancel_icon]} size={12} color="#FFFFFF" />
                </Button>                
              </View>;

      settingsTable = <View style={{flex: 1, flexDirection: 'row'}}>
                        <Text style={{flex: 1, alignSelf: 'flex-start'}}></Text>
                        <Button onPress={this.switchKeypad} style={styles.hidekeypad}>Hide</Button>
                      </View>;

      if (this.state.status == 'connected_keypad') keypad = <Keypad keyPressed={this._keypadPressed} />;

    } else if (this.state.status == 'inboundcall') {

      modalButtons = <View style={styles.modalButtons}>
      <Button onPress={this.answerCall} style={styles.callbutton}>Answer</Button>
      <Button onPress={this.rejectCall} style={styles.cancelbutton}>Reject</Button>
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
         <Modal backdropType="blur" 
                isVisible={this.state.isModalOpen} 
                onClose={() => this.closeModal()} 
                onPressBackdrop={this.onPressBackdrop}>
          <Text>{this.state.modalText}</Text>
          {modalButtons}
        </Modal>
      </View>;
  }
});

var styles = StyleSheet.create({
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
    alignSelf: 'flex-start',
    paddingVertical: 15
  }
});

module.exports = UserAgent;