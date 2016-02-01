'use strict';

import React, { 
  DeviceEventEmitter, 
  Dimensions,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  LayoutAnimation,
  Image,
  Modal,
  TouchableHighlight,
  Platform
} from 'react-native';
import Button from 'react-native-button';

var animations = {
  layout: {
    spring: {
      duration: 300,
      create: {
        duration: 300,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 200
      }
    },
    easeInEaseOut: {
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.scaleXY
      },
      update: {
        delay: 100,
        type: LayoutAnimation.Types.easeInEaseOut
      }
    }
  }
};

var usernameValue ='alexey',
    appnameValue = 'myapp',
    accnameValue = 'aylarov',
    passwordValue = 'testpass';

class LoginForm extends React.Component {

  constructor() {
    super();
    this.state = {
      keyboardSpace: 0,
      isKeyboardOpened: false,
      modalText: '',
      isModalOpen: false
    }
    this.keyboardWillShow = this.keyboardWillShow.bind(this);
    this.keyboardWillHide = this.keyboardWillHide.bind(this);
  }

  componentWillMount() {    
    DeviceEventEmitter.addListener(Platform.OS=="ios"?'keyboardWillShow':'keyboardDidShow', this.keyboardWillShow);
    DeviceEventEmitter.addListener(Platform.OS=="ios"?'keyboardWillHide':'keyboardDidHide', this.keyboardWillHide);
  }

  componentDidMount() {        
    this._thisAccname.focus();
  }

  componentWillUnmount() {
    DeviceEventEmitter.removeAllListeners(Platform.OS=="ios"?'keyboardWillShow':'keyboardDidShow', this.keyboardWillShow);
    DeviceEventEmitter.removeAllListeners(Platform.OS=="ios"?'keyboardWillHide':'keyboardDidHide', this.keyboardWillHide);    
  }

  keyboardWillShow(e: Event) {
    if (typeof e.endCoordinates != "undefined") {
      this.setState({
        keyboardSpace: e.endCoordinates.height,
        isKeyboardOpened: true
      });
    }
  }

  keyboardWillHide(e: Event) {
    this.setState({
      keyboardSpace: 0,
      isKeyboardOpened: false
    });
  }

  componentWillUpdate(props, state) {
    if (state.isKeyboardOpened !== this.state.isKeyboardOpened) {
      LayoutAnimation.configureNext(animations.layout.spring);
    }
  }

  buttonClicked() {
  	this.props.login(accnameValue, appnameValue, usernameValue, passwordValue);    
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
    this.setState(React.addons.update(
        this.state, 
        { 
          $merge: {
            modalText: text,
            isModalOpen: true          
          }
        }));
  }

  closeModal() {
    this.setState(React.addons.update(
        this.state, 
        { 
          $merge: {
            isModalOpen: false          
          }
        }));
  }

  componentDidUpdate() {
    //console.log(this.state);
  }

  render() {
    return (
      <View style={[styles.container]}>        
        <View style={[styles.formcontainer, {marginBottom: this.state.keyboardSpace}]}>
          <View style={styles.loginform}>
            <TextInput style={styles.forminput} onChangeText={(e) => this.updateAccText(e)}
              placeholder="Account name" initialValue={accnameValue}
              autoFocus={false} ref={component => this._thisAccname = component}
              onFocus={this.inputFocus} 
              autoCapitalize="none"
              autoCorrect={false} />
            <TextInput style={styles.forminput} onChangeText={(e) => this.updateAppText(e)}
              placeholder="Application name" initialValue={appnameValue} 
              ref={component => this._thisAppname = component} 
              autoCapitalize="none"
              autoCorrect={false} />
            <TextInput style={styles.forminput} onChangeText={(e) => this.updateUserText(e)}
              placeholder="User name" initialValue={usernameValue} 
              ref={component => this._thisUsername = component} 
              autoCapitalize="none"
              autoCorrect={false} />
            <TextInput style={styles.forminput} onChangeText={(e) => this.updatePasswordText(e)}
              placeholder="User password" initialValue={passwordValue}
              secureTextEntry={true} ref={component => this._thisPassword = component} />
            <Button style={styles.loginbutton} onPress={(e) => this.buttonClicked(e)}>Login</Button>
          </View>            
        </View>
        <Modal animated={true} transparent={true} visible={this.state.isModalOpen}>
            <TouchableHighlight onPress={(e) => this.closeModal(e)} style={styles.container}>
              <View style={[styles.container, styles.modalBackground]}>
                <View style={[styles.innerContainer, styles.innerContainerTransparent]}>
                  <Text>{this.state.modalText}</Text>
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
  formcontainer: {
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
    flex:1 ,
		borderRadius: 4,
		padding: 5,
		marginBottom: 10,
		height: 40, 
		borderColor: 'gray', 
		borderWidth: 0.5
	},
  loginbutton: {
    backgroundColor: '#23a9e2',
    color: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 4
  }
});

export default LoginForm;