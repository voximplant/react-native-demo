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
    formInstance;

export default class VoxImplantDemo extends Component {

  constructor() {
    super();
    this.state = {
      page: 'connection',
      userName: ''
    }
  }

  componentDidMount() {
    _this = this;
    loginManager.getInstance().on('onLoggedIn', (param) => this.onLogin(param));
    loginManager.getInstance().on('onConnected', () => this.onConnected());
    loginManager.getInstance().on('onConnectionClosed', () => this.onConnectionClosed());
    loginManager.getInstance().on('onConnectionFailed', (reason) => this.onConnectionFailed(reason));
    loginManager.getInstance().connect(true);
  }

  onConnected() {
    _this.setState({page: 'login'});
  }

  onLogin(displayName) {
    _this.setState({userName: displayName, page: 'useragent'});
  }

  onConnectionFailed(reason) {
    console.log("index ios onConnectionClosed");
  }

  onConnectionClosed() {
    console.log("index ios onConnectionClosed");
  }

  render() {
    let ui = <Loader />;
    if (this.state.page == "login") {
      ui = <LoginForm
              ref={(component) => formInstance = component}
            />;
    }
    if (this.state.page == "useragent") {
      ui = <UserAgent uaDisplayName={this.state.userName} />;
    }
    return ui;
  }
}

AppRegistry.registerComponent('VoxImplantDemo', () => VoxImplantDemo);
