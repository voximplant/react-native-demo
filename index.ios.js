/**
 * Voximplant Demo Application
 * https://github.com/voximplant/react-native-demo
 */
'use strict';

var React = require('react-native');
var Modal = require('react-native-modal');
var KeyboardEvents = require('react-native-keyboardevents');
var KeyboardEventEmitter = KeyboardEvents.Emitter;
var TimerMixin = require('react-timer-mixin');
var RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');
var VoxImplant = require("react-native-voximplant");
var Loader = require('./Loader');
var LoginForm = require('./LoginForm');
var UserAgent = require('./UserAgent');


var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  LayoutAnimation
} = React;

var _this,  
    formInstance,
    uaDisplayName;

RCTDeviceEventEmitter.addListener(
  'ConnectionSuccessful',
  () => {
   console.log('Connection successful');
   _this.setState({page: 'login'});
  }
);

RCTDeviceEventEmitter.addListener(
  'LoginSuccessful',
  (obj) => {
    uaDisplayName = obj.displayName;
    console.log('Login successful '+uaDisplayName);
    _this.setState({
      page: 'useragent'
    });
  }
);

RCTDeviceEventEmitter.addListener(
  'LoginFailed',
  (code) => {
    console.log('Login failed');
    formInstance.setModalText('Login failed');
    formInstance.openModal();
  }
);


var VoximplantDemo = React.createClass({

  mixins: [TimerMixin, Modal.Mixin],

  getInitialState: function() {
    VoxImplant.SDK.closeConnection();
    return {
      page: 'connection',
    };
  },

  componentDidMount: function() {
    _this = this;
    VoxImplant.SDK.connect();    
  },

  componentDidUpdate: function() {
    if (this.state.page == "useragent") {
      VoxImplant.SDK.setCameraResolution(320,240);
    }
  },

  _login: function(accnameValue, appnameValue, usernameValue, passwordValue) {
    VoxImplant.SDK.login(usernameValue +
      "@" + appnameValue +
      "." + accnameValue +
      ".voximplant.com", passwordValue);
  },

  render: function() {
    var ui = <Loader />;
    console.log('uaDisplayName: '+uaDisplayName);
    if (this.state.page == "login") ui = <LoginForm login={this._login} ref={(component) => formInstance = component}/>;
    else if (this.state.page == "useragent") ui = <UserAgent uaDisplayName={uaDisplayName} />;
    return (ui);
  }
});

var styles = StyleSheet.create({ 
  
});

AppRegistry.registerComponent('VoximplantDemo', () => VoximplantDemo);