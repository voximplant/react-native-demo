/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  DeviceEventEmitter
} from 'react-native';
import VoxImplant from "react-native-voximplant";
import Loader from './Loader';
import LoginForm from './LoginForm';
import UserAgent from './UserAgent';

import loginManager from './LoginManager';

var _this,  
    formInstance,
    uaDisplayName;

export default class VoxImplantDemo extends Component {

  constructor() {
    super();
    loginManager.init();
    this.state = {
      page: 'connection'
    }
  }

  componentDidMount() {
    _this = this;
    loginManager.on('onLoggedIn', (param) => this.onLogin(param));
    loginManager.on('onConnected', () => this.onConnected());
    loginManager.on('onConnectionFailed', (reason) => this.onConnectionFailed(reason));
    loginManager.connect(true);
  }

  onConnected() {
    _this.setState({page: 'login'});
  }

  onLogin(displayName) {
    uaDisplayName = displayName;
    _this.setState({page: 'useragent'});
  }

  onConnectionFailed(reason) {
    //TODO
  }

  render() {
    let ui = <Loader />;
    if (this.state.page == "login") {
      ui = <LoginForm
              ref={(component) => formInstance = component}
            />;
    }
    if (this.state.page == "useragent") {
      ui = <UserAgent uaDisplayName={uaDisplayName} />;
    }
    return ui;
  }
}

AppRegistry.registerComponent('VoxImplantDemo', () => VoxImplantDemo);
