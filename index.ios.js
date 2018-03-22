/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  DeviceEventEmitter,
  Button
} from 'react-native';

import Loader from './Loader';
import LoginForm from './LoginForm';
import UserAgent from './UserAgent';
import pushManager from './PushManager';
import loginManager from './LoginManager';

var _this,  
    formInstance;

export default class VoxImplantDemo extends Component {

  constructor() {
    super();

    pushManager.init();
    this.state = {
      page: 'connection',
      userName: ''
    };
  }

  componentDidMount() {
    _this = this;  
    loginManager.getInstance().on('onLoggedIn', (param) => this.onLogin(param));
    loginManager.getInstance().on('onConnected', () => this.onConnected());
    loginManager.getInstance().on('onConnectionFailed', (reason) => this.onConnectionFailed(reason));
    loginManager.getInstance().on('onConnectionClosed', () => this.onConnectionClosed());
    loginManager.getInstance().connect(false);
    if (loginManager.getInstance().loggedIn) {
      _this.setState({page: 'useragent'});
    } else if (loginManager.getInstance().connected) {
      _this.setState({page: 'login'});
    }
  }

  onConnected() {
    _this.setState({page: 'login'});
  }

  onLogin(displayName) {
    _this.setState({userName: displayName, page: 'useragent'});
  }

  onConnectionFailed(reason) {
    console.log("connection failed");
    this.setState({ page: 'retry' });
  }

  onConnectionClosed() {
    console.log("connection closed");
    this.setState({ page: 'connection'});
    loginManager.getInstance().connect(false);
  }

  reconnect() {
    this.setState({ page: 'connection' });
    loginManager.getInstance().connect(false)
  }

  render() {
    let ui = <Loader />;

    if (this.state.page === 'retry') {
      ui = (
        <View style={{ flex: 1, alignItems:'center', justifyContent:'center' }}>
          <Text>Internet connection is lost. Reconnect?</Text>
          <Button title="OK" onPress={ () => this.reconnect() }/>
        </View>
      );
    }

    if (this.state.page === 'login') {
      ui = <LoginForm 
              ref={(component) => formInstance = component}
            />;
    }
    if (this.state.page === 'useragent') {
      ui = <UserAgent uaDisplayName={this.state.userName} />;
    }

    return ui;
  }
}

AppRegistry.registerComponent('VoxImplantDemo', () => VoxImplantDemo);
