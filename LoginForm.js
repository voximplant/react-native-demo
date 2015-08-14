'use strict';

var React = require('react-native');
var Button = require('react-native-button');
var Modal = require('react-native-modal');
var KeyboardEvents = require('react-native-keyboardevents');
var KeyboardEventEmitter = KeyboardEvents.Emitter;

var {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  LayoutAnimation,
  Image
} = React;

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

var formInstance,
    usernameValue ='alexey',
    appnameValue = 'myapp',
    accnameValue = 'aylarov',
    passwordValue = 'testpass';

var LoginForm = React.createClass({

  mixins: [Modal.Mixin],

  getInitialState: function() {
    return {
      keyboardSpace: 0,
      isKeyboardOpened: false,
      modalText: ''     
    };
  },

  componentDidMount: function() {
    formInstance = this;
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardDidShowEvent, this.updateKeyboardSpace);
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace);
    this._thisAccname.focus();
  },

  componentWillUnmount: function() {
    KeyboardEventEmitter.off(KeyboardEvents.KeyboardDidShowEvent, this.updateKeyboardSpace);
    KeyboardEventEmitter.off(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace);
  },

  componentWillUpdate: function(props, state) {
    if (state.isKeyboardOpened !== this.state.isKeyboardOpened) {
      LayoutAnimation.configureNext(animations.layout.spring);
    }
  },

  updateKeyboardSpace: function(frames) {
    this.setState({
      keyboardSpace: frames.end.height,
      isKeyboardOpened: true
    });
  },

  resetKeyboardSpace: function() {
    this.setState({
      keyboardSpace: 0,
      isKeyboardOpened: false
    });
  },

  buttonClicked: function() {
  	this.props.login(accnameValue, appnameValue, usernameValue, passwordValue);    
  },

  updateAccText: function(text) {
    accnameValue = text;
    this._thisAccname.setNativeProps({text: text});
  },

  updateAppText: function(text) {
    appnameValue = text;
    this._thisAppname.setNativeProps({text: text});
  },

  updateUserText: function(text) {
    usernameValue = text;
    this._thisUsername.setNativeProps({text: text});
  },

  updatePasswordText: function(text) {
    passwordValue = text;
    this._thisPassword.setNativeProps({text: text});
  },

  inputFocus: function(e) {

  },

  setModalText: function(text) {
    this.setState(React.addons.update(
        this.state, 
        { 
          $merge: {
            modalText: text          
          }
        }));
  },

  render: function() {
    return (
      <View style={[styles.container, {marginBottom: this.state.keyboardSpace}]}>        
        <View style={styles.formcontainer}>
          <Image style={styles.appheader} source={require('image!AppHeader')}></Image>
          <View style={styles.loginform}>
            <TextInput style={styles.forminput} onChangeText={this.updateAccText}
              placeholder="Account name" value={accnameValue}
              autoFocus={false} ref={component => this._thisAccname = component}
              onFocus={this.inputFocus} />
            <TextInput style={styles.forminput} onChangeText={this.updateAppText}
              placeholder="Application name" value={appnameValue} 
              ref={component => this._thisAppname = component} />
            <TextInput style={styles.forminput} onChangeText={this.updateUserText}
              placeholder="User name" value={usernameValue} 
              ref={component => this._thisUsername = component}/>
            <TextInput style={styles.forminput} onChangeText={this.updatePasswordText}
              placeholder="User password" value={passwordValue}
              secureTextEntry="true" ref={component => this._thisPassword = component} />
            <Button style={styles.loginbutton} onPress={this.buttonClicked}>Login</Button>
          </View>  
          <Modal backdropType="blur" 
                  isVisible={this.state.isModalOpen} 
                  onClose={() => this.closeModal()} 
                  onPressBackdrop={() => this.closeModal()}>
            <Text>{this.state.modalText}</Text>
          </Modal>
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
	container: {
    flex: 1,    
    justifyContent: 'center',
    alignItems: 'stretch'    
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
		borderRadius: 2,
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
    borderRadius: 2
  }
});

module.exports = LoginForm;