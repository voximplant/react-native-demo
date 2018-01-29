/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React, { Component } from 'react';
import {
  DeviceEventEmitter, 
  Dimensions,
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Platform,
  Modal,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';

import loginManager from './LoginManager';
import DefaultPreference from 'react-native-default-preference';

var passwordValue = '',
    _this;

export default class LoginForm extends Component {
  constructor() {
    super();
    loginManager.getInstance().on('onLoginFailed', (errorCode) => this.onLoginFailed(errorCode));
    loginManager.getInstance().on('onLoggedIn', (param) => this.saveUsername());
    
    this.state = {
      modalText: '',
      isModalOpen: false,
      usernameValue: ''
    }
  }

  componentDidMount() {
    _this = this;
    this.fillFields();
  }

  fillFields() {
    DefaultPreference.get('usernameValue').then(
      function(value) {
        _this.setState({usernameValue: value}); 
      });
  }

  onLoginFailed(errorCode) {
    switch(errorCode) {
      case 401:
        this.setModalText('Invalid password');
        break;
      case 403:
        this.setModalText('Account frozen');
        break;
      case 404: 
        this.setModalText('Invalid username')
        break;
      case 701:
        this.setModalText('Token expired');
        break;
      default:
      case 500:
        this.setModalText('Internal error');
    }
  }

  saveUsername() {
    DefaultPreference.set('usernameValue', this.state.usernameValue);
  }

  focusNextField = (nextField) => {
    this.refs[nextField].focus();
  };

  loginClicked() {
    loginManager.getInstance().loginWithPassword(this.state.usernameValue +
                                  ".voximplant.com", passwordValue);
  }

  loginWithOneTimeKeyClicked() {
    loginManager.getInstance().requestOneTimeKey(this.state.usernameValue + 
                                  ".voximplant.com", passwordValue);
  }

  updateUserText(text) {
    this.setState({usernameValue: text});
  }

  updatePasswordText(text) {
    passwordValue = text;
  }

  setModalText(text) {
    this.setState({ isModalOpen: true, modalText: text });
  }

  closeModal() {
    this.setState({ isModalOpen: false });
  }

  render() {
    return (
      <View style={[styles.container]}>        
        <View>
          <View style={ styles.loginform }>
            <TextInput 
                  style={ styles.forminput } 
                  placeholder="user@app.account" 
                  value={ this.state.usernameValue }
                  autoFocus={ true }
                  ref='acc'
                  autoCapitalize='none'
                  autoCorrect={ false } 
                  onSubmitEditing={ (event) => this.focusNextField('password') }
                  onChangeText={ (e) => this.updateUserText(e) }
                  blurOnSubmit={ true } />
            <TextInput 
                  style={ styles.forminput } 
                  placeholder="User password" 
                  defaultValue={ passwordValue }
                  secureTextEntry={ true } 
                  ref='password'
                  onChangeText={ (e) => this.updatePasswordText(e) }
                  blurOnSubmit={ true } />
            <TouchableOpacity onPress={ () => this.loginClicked() } style={{width: 200, alignSelf: 'center'}}>
              <Text style = {styles.loginbutton}>
                  Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={ () => this.loginWithOneTimeKeyClicked() } style={{width: 200, alignSelf: 'center'}}>
              <Text style = {styles.loginbutton}>
                  Login With One Time Key
              </Text>
            </TouchableOpacity>
          </View>            
        </View>
        <Modal 
          animationType='fade'
          transparent={ true } 
          visible={ this.state.isModalOpen } 
          onRequestClose={ () => {} }>
            <TouchableHighlight 
              onPress={ (e) => this.closeModal(e) } 
              style={ styles.container }>
              <View style={[styles.container, styles.modalBackground]}>
                <View 
                  style={[styles.innerContainer, styles.innerContainerTransparent]}>
                  <Text>{ this.state.modalText }</Text>
                </View>
              </View>
            </TouchableHighlight>
        </Modal>
      </View>
    );
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
	appheader: {
    resizeMode: 'contain',
		height: 60,
    alignSelf: 'center'
	},
	loginform: {
		paddingHorizontal: 20,
    alignItems: 'stretch'
  },
  loginbutton: {
    color: '#23a9e2',
    fontSize: 16,
    alignSelf: 'center',
    paddingTop: 20,
    textAlign: 'center'
  },
	forminput: {
    padding: 5,
    marginBottom: 10,
    height: 40, 
    ...Platform.select({
      ios: {
        height: 40,
        borderColor: '#0f0f0f',
        borderWidth: 0.5,
        borderRadius: 4,
      }
    })
	}
});