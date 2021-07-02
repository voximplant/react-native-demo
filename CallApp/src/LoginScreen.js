import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import styles from './Styles';
import {Voximplant} from 'react-native-voximplant';
import {VOXIMPLANT_ACCOUNT, VOXIMPLANT_APP} from './Constants';

const LoginScreen = () => {
  const navigation = useNavigation();
  const voximplant = Voximplant.getInstance();
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  async function login() {
    try {
      let clientState = await voximplant.getClientState();
      if (clientState === Voximplant.ClientState.DISCONNECTED) {
        await voximplant.connect();
        await voximplant.login(
          `${user}@${VOXIMPLANT_APP}.${VOXIMPLANT_ACCOUNT}.voximplant.com`,
          password,
        );
      }
      if (clientState === Voximplant.ClientState.CONNECTED) {
        await voximplant.login(
          `${user}@${VOXIMPLANT_APP}.${VOXIMPLANT_ACCOUNT}.voximplant.com`,
          password,
        );
      }
      navigation.navigate('Main');
    } catch (e) {
      let message;
      switch (e.name) {
        case Voximplant.ClientEvents.ConnectionFailed:
          message = 'Connection error, check your internet connection';
          break;
        case Voximplant.ClientEvents.AuthResult:
          message = convertCodeMessage(e.code);
          break;
        default:
          message = 'Unknown error. Try again';
      }
      showLoginError(message);
    }
  }

  function convertCodeMessage(code) {
    switch (code) {
      case 401:
        return 'Invalid password';
      case 404:
        return 'Invalid user';
      case 491:
        return 'Invalid state';
      default:
        return 'Try again later';
    }
  }

  function showLoginError(message) {
    Alert.alert('Login error', message, [
      {
        text: 'OK',
      },
    ]);
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safearea}>
        <View style={[styles.container]}>
          <TextInput
            underlineColorAndroid="transparent"
            style={styles.forminput}
            placeholder="User name"
            autoFocus={true}
            returnKeyType={'next'}
            autoCapitalize="none"
            autoCorrect={false}
            blurOnSubmit={false}
            onChangeText={(text) => setUser(text)}
          />
          <TextInput
            underlineColorAndroid="transparent"
            style={styles.forminput}
            placeholder="User password"
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
            blurOnSubmit={true}
          />
          <TouchableOpacity onPress={() => login()} style={styles.button}>
            <Text style={styles.textButton}>LOGIN</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

export default LoginScreen;
