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
  TouchableHighlight
} from 'react-native';

import loginManager from './LoginManager';

var usernameValue ='',
    appnameValue = '',
    accnameValue = '',
    passwordValue = '';

export default class LoginForm extends Component {
  constructor() {
    super();
    this.state = {
      modalText: '',
      isModalOpen: false
    }
  }

  focusNextField = (nextField) => {
    this.refs[nextField].focus();
  };

  buttonClicked() {
    loginManager.loginWithPassword(usernameValue +
                                  "@" + appnameValue +
                                  "." + accnameValue +
                                  ".voximplant.com", passwordValue)   
  }

  updateAccText(text) {
    accnameValue = text;
  }

  updateAppText(text) {
    appnameValue = text;
  }

  updateUserText(text) {
    usernameValue = text;
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
                  placeholder="Account name" 
                  defaultValue={ accnameValue }
                  autoFocus={ true }
                  ref='acc'
                  autoCapitalize='none'
                  autoCorrect={ false } 
                  onSubmitEditing={ (event) => this.focusNextField('app') }
                  onChangeText={ (e) => this.updateAccText(e) }
                  blurOnSubmit={ false } />
            <TextInput 
                  style={ styles.forminput } 
                  placeholder="Application name" 
                  defaultValue={ appnameValue } 
                  ref='app'
                  autoCapitalize='none'
                  autoCorrect={ false } 
                  onSubmitEditing={ (event) => this.focusNextField('user') }
                  onChangeText={ (e) => this.updateAppText(e) }
                  blurOnSubmit={ false } />
            <TextInput 
                  style={ styles.forminput } 
                  placeholder="User name" 
                  defaultValue={ usernameValue } 
                  ref='user'
                  autoCapitalize='none'
                  autoCorrect={ false }
                  onSubmitEditing={ (event) => this.focusNextField('password') }
                  onChangeText={ (e) => this.updateUserText(e) }
                  blurOnSubmit={ false } />
            <TextInput 
                  style={ styles.forminput } 
                  placeholder="User password" 
                  defaultValue={ passwordValue }
                  secureTextEntry={ true } 
                  ref='password'
                  onChangeText={ (e) => this.updatePasswordText(e) }
                  blurOnSubmit={ true } />
            <Button 
                  onPress={ (e) => this.buttonClicked(e) }
                  title="Login"
                  color='#23a9e2'
                  style={ styles.loginbutton }
            />
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
	forminput: {
    fontSize: 16,
    padding: 10,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        height: 40,
        borderColor: '#0f0f0f',
        borderWidth: 0.5
      }
    })
	}
});