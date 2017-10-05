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
//import DefaultPreference from 'react-native-default-preference';

var passwordValue = '',
    _this;

export default class LoginForm extends Component {
  constructor() {
    super();
    loginManager.on('onLoginFailed', (errorCode) => this.onLoginFailed(errorCode));
    loginManager.on('onLoggedIn', (param) => this.saveUsername());
    
    this.state = {
      modalText: '',
      isModalOpen: false,
      usernameValue: '',
      appnameValue: '',
      accnameValue: ''
    }
  }

  componentDidMount() {
    _this = this;
    this.fillFields();
  }

  fillFields() {
    // DefaultPreference.get('usernameValue').then(
    //   function(value) {
    //     _this.setState({usernameValue: value}); 
    //   });
    // DefaultPreference.get('appnameValue').then(
    //   function(value) {
    //     _this.setState({appnameValue: value});
    //   });
    // DefaultPreference.get('accnameValue').then(
    //   function(value) {
    //     _this.setState({accnameValue: value});
    //   });
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
    // DefaultPreference.set('usernameValue', this.state.usernameValue);
    // DefaultPreference.set('appnameValue', this.state.appnameValue);
    // DefaultPreference.set('accnameValue', this.state.accnameValue);
  }

  focusNextField = (nextField) => {
    this.refs[nextField].focus();
  };

  buttonClicked() {
    loginManager.loginWithPassword(this.state.usernameValue +
                                  "@" + this.state.appnameValue +
                                  "." + this.state.accnameValue +
                                  ".voximplant.com", passwordValue)   
  }

  updateAccText(text) {
    this.setState({accnameValue: text});
  }

  updateAppText(text) {
    this.setState({appnameValue: text});
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
                  placeholder="Account name" 
                  value={ this.state.accnameValue }
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
                  value={ this.state.appnameValue } 
                  ref='app'
                  autoCapitalize='none'
                  autoCorrect={ false } 
                  onSubmitEditing={ (event) => this.focusNextField('user') }
                  onChangeText={ (e) => this.updateAppText(e) }
                  blurOnSubmit={ false } />
            <TextInput 
                  style={ styles.forminput } 
                  placeholder="User name" 
                  value={ this.state.usernameValue } 
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