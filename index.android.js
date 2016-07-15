/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  DeviceEventEmitter,
  ToastAndroid
} from 'react-native';
import VoxImplant from 'react-native-voximplant';
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
    ToastAndroid.show('Login failed', ToastAndroid.SHORT);
  }
);

class VoximplantDemo extends React.Component {

  constructor() {
    super();
    VoxImplant.SDK.closeConnection();
    this.state = {
      page: 'connection'
    };
  }

  componentDidMount() {
    _this = this;
    VoxImplant.SDK.connect();
  }

  _login(accnameValue, appnameValue, usernameValue, passwordValue) {
    VoxImplant.SDK.login(usernameValue +
      "@" + appnameValue +
      "." + accnameValue +
      ".voximplant.com", passwordValue);
  }

  render() {
    let ui = <Loader />;
    if (this.state.page == "login") ui = <LoginForm login={(...params) => this._login(...params)} ref={(component) => formInstance = component}/>;
    else if (this.state.page == "useragent") ui = <UserAgent uaDisplayName={uaDisplayName} />;
    return (ui);
  }
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('VoximplantDemo', () => VoximplantDemo);
