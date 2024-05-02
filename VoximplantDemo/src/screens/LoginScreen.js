/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
  Text,
  View,
  TextInput,
  Platform,
  Modal,
  TouchableHighlight,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';

import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginManager from '../manager/LoginManager';
import COLOR_SCHEME from '../styles/ColorScheme';
import COLOR from '../styles/Color';
import styles from '../styles/Styles';
import CallManager from '../manager/CallManager';
import {Voximplant} from 'react-native-voximplant';

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.password = '';
    this.state = {
      username: '',
      isModalOpen: false,
      modalText: '',
      node: null,
    };

    this.data = [
      {label: 'Node 1', value: Voximplant.ConnectionNode.NODE_1},
      {label: 'Node 2', value: Voximplant.ConnectionNode.NODE_2},
      {label: 'Node 3', value: Voximplant.ConnectionNode.NODE_3},
      {label: 'Node 4', value: Voximplant.ConnectionNode.NODE_4},
      {label: 'Node 5', value: Voximplant.ConnectionNode.NODE_5},
      {label: 'Node 6', value: Voximplant.ConnectionNode.NODE_6},
      {label: 'Node 7', value: Voximplant.ConnectionNode.NODE_7},
      {label: 'Node 8', value: Voximplant.ConnectionNode.NODE_8},
      {label: 'Node 9', value: Voximplant.ConnectionNode.NODE_9},
      {label: 'Node 10', value: Voximplant.ConnectionNode.NODE_10},
    ];
  }

  componentDidMount() {
    AsyncStorage.getItem('usernameValue').then(username => {
      this.setState({username: username});
    });
    LoginManager.getInstance().on('onConnectionFailed', reason =>
      this.onConnectionFailed(reason),
    );
    LoginManager.getInstance().on('onLoggedIn', displayName =>
      this.onLoggedIn(displayName),
    );
    LoginManager.getInstance().on('onLoginFailed', errorCode =>
      this.onLoginFailed(errorCode),
    );

    // Workaround to navigate to the IncomingCallScreen if a push notification was received in 'killed' state
    if (Platform.OS === 'android') {
      if (CallManager.getInstance().showIncomingCallScreen) {
        this.props.navigation.navigate('IncomingCall', {
          callId: CallManager.getInstance().call.callId,
          isVideo: null,
          from: CallManager.getInstance().call.getEndpoints()[0].displayName,
        });
      }
    }
  }

  onLoginFailed(errorCode) {
    switch (errorCode) {
      case 401:
        this.setState({isModalOpen: true, modalText: 'Invalid password'});
        break;
      case 403:
        this.setState({isModalOpen: true, modalText: 'Account frozen'});
        break;
      case 404:
        this.setState({isModalOpen: true, modalText: 'Invalid username'});
        break;
      case 701:
        this.setState({isModalOpen: true, modalText: 'Token expired'});
        break;
      default:
      case 500:
        this.setState({isModalOpen: true, modalText: 'Internal error'});
    }
  }

  onLoggedIn(displayName) {
    (async () => {
      await AsyncStorage.setItem('usernameValue', this.state.username);
    })();
    this.props.navigation.navigate('Main');
  }

  onConnectionFailed(reason) {
    this.setState({
      isModalOpen: true,
      modalText: 'Failed to connect, check internet settings',
    });
  }

  loginClicked() {
    if (this.state.node === null) {
      console.error('Connection node is required');
      return;
    }
    LoginManager.getInstance().loginWithPassword(
      this.state.username + '.voximplant.com',
      this.password,
      this.state.node,
    );
  }

  _focusNextField(nextField) {
    this.refs[nextField].focus();
  }

  render() {
    return (
      <SafeAreaView style={styles.safearea}>
        <StatusBar
          barStyle={
            Platform.OS === 'ios' ? COLOR_SCHEME.DARK : COLOR_SCHEME.LIGHT
          }
          backgroundColor={COLOR.PRIMARY_DARK}
        />
        <View style={[styles.container]}>
          <View>
            <View style={styles.loginform}>
              <TextInput
                underlineColorAndroid="transparent"
                style={styles.forminput}
                placeholder="user@app.account"
                value={this.state.username}
                autoFocus={true}
                returnKeyType={'next'}
                autoCapitalize="none"
                autoCorrect={false}
                onSubmitEditing={() => this._focusNextField('password')}
                onChangeText={text => {
                  this.setState({username: text});
                }}
                blurOnSubmit={false}
              />
              <TextInput
                underlineColorAndroid="transparent"
                style={styles.forminput}
                placeholder="User password"
                secureTextEntry={true}
                ref="password"
                onChangeText={text => {
                  this.password = text;
                }}
                blurOnSubmit={true}
              />
              <Dropdown
                style={[styles.dropdown]}
                data={this.data}
                labelField="label"
                valueField="value"
                placeholder="Connection node"
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropdownSelectedText}
                itemTextStyle={styles.dropdownItemText}
                onChange={item => {
                  this.setState({node: item.value});
                }}
              />
              <TouchableOpacity
                onPress={() => this.loginClicked()}
                style={{width: 220, alignSelf: 'center'}}>
                <Text style={styles.loginbutton}>LOGIN</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.isModalOpen}>
            <TouchableHighlight
              onPress={e => this.setState({isModalOpen: false})}
              style={styles.container}>
              <View style={[styles.container, styles.modalBackground]}>
                <View
                  style={[
                    styles.innerContainer,
                    styles.innerContainerTransparent,
                  ]}>
                  <Text>{this.state.modalText}</Text>
                </View>
              </View>
            </TouchableHighlight>
          </Modal>
        </View>
      </SafeAreaView>
    );
  }
}
