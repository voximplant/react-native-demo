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
  DeviceEventEmitter,
  ToastAndroid,
  Button
} from 'react-native';

import loginManager from './LoginManager';

import VoxImplant from 'react-native-voximplant';
import Loader from './Loader';
import LoginForm from './LoginForm';
import UserAgent from './UserAgent';
import pushManager from './PushManager';
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';

export default class VoximplantDemo extends Component {
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
    this.setState({ page: 'retry' });
  }

  onConnectionClosed() {
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

AppRegistry.registerComponent('VoximplantDemo', () => VoximplantDemo);
