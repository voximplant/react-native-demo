/**
 * Voximplant Demo Application
 * https://github.com/voximplant/react-native-demo
 */
'use strict';

import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  LayoutAnimation,
  Modal,
  DeviceEventEmitter
} from 'react-native';
import VoxImplant from "react-native-voximplant";
import Loader from './Loader';
import LoginForm from './LoginForm';
import UserAgent from './UserAgent';

var _this,  
    formInstance,
    uaDisplayName;

DeviceEventEmitter.addListener(
  'ConnectionSuccessful',
  () => {
   console.log('Connection successful');
   _this.setState({page: 'login'});
  }
);

DeviceEventEmitter.addListener(
  'LoginSuccessful',
  (obj) => {
    uaDisplayName = obj.displayName;
    console.log('Login successful '+uaDisplayName);
    _this.setState({
      page: 'useragent'
    });
  }
);

DeviceEventEmitter.addListener(
  'LoginFailed',
  (code) => {
    console.log('Login failed');
    formInstance.setModalText('Login failed');
  }
);


class VoximplantDemo extends React.Component {

  constructor() {
    super();
    VoxImplant.SDK.closeConnection();
    this.state = {
      page: 'connection'
    }
  }

  componentDidMount() {
    _this = this;
    VoxImplant.SDK.connect();    
  }

  componentDidUpdate() {
    if (this.state.page == "useragent") {
      VoxImplant.SDK.setCameraResolution(320,240);
    }
  }

  _login(accnameValue, appnameValue, usernameValue, passwordValue) {
    VoxImplant.SDK.login(usernameValue +
      "@" + appnameValue +
      "." + accnameValue +
      ".voximplant.com", passwordValue);
  }

  render() {
    var ui = <Loader />;
    if (this.state.page == "login") ui = <LoginForm login={(...params) => this._login(...params)} ref={(component) => formInstance = component}/>;
    else if (this.state.page == "useragent") ui = <UserAgent uaDisplayName={uaDisplayName} />;
    return (ui);
  }

}

var styles = StyleSheet.create({ 
  
});

AppRegistry.registerComponent('VoximplantDemo', () => VoximplantDemo);