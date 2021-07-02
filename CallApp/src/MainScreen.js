import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import styles from './Styles';
import {Voximplant} from 'react-native-voximplant';
import calls from './Store';

const MainScreen = () => {
  const navigation = useNavigation();
  const [callee, setCallee] = useState('');
  const voximplant = Voximplant.getInstance();

  useEffect(() => {
    voximplant.on(Voximplant.ClientEvents.IncomingCall, (incomingCallEvent) => {
      calls.set(incomingCallEvent.call.callId, incomingCallEvent.call);
      navigation.navigate('IncomingCall', {
        callId: incomingCallEvent.call.callId,
      });
    });
    return function cleanup() {
      voximplant.off(Voximplant.ClientEvents.IncomingCall);
    };
  });

  async function makeCall(isVideoCall) {
    try {
      if (Platform.OS === 'android') {
        let permissions = [PermissionsAndroid.PERMISSIONS.RECORD_AUDIO];
        if (isVideoCall) {
          permissions.push(PermissionsAndroid.PERMISSIONS.CAMERA);
        }
        const granted = await PermissionsAndroid.requestMultiple(permissions);
        const recordAudioGranted =
          granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === 'granted';
        const cameraGranted =
          granted[PermissionsAndroid.PERMISSIONS.CAMERA] === 'granted';
        if (recordAudioGranted) {
          if (isVideoCall && !cameraGranted) {
            console.warn(
              'MainScreen: makeCall: camera permission is not granted',
            );
            return;
          }
        } else {
          console.warn(
            'MainScreen: makeCall: record audio permission is not granted',
          );
          return;
        }
      }
      navigation.navigate('Call', {
        isVideoCall: isVideoCall,
        callee: callee,
        isIncomingCall: false,
      });
    } catch (e) {
      console.warn(`MainScreen: makeCall failed: ${e}`);
    }
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safearea}>
        <View style={styles.container}>
          <TextInput
            underlineColorAndroid="transparent"
            style={[styles.forminput, styles.margin]}
            onChangeText={(text) => setCallee(text)}
            placeholder="Call to"
            autoCapitalize="none"
            autoCorrect={false}
            blurOnSubmit={true}
          />
          <TouchableOpacity
            onPress={() => makeCall(true)}
            style={styles.button}>
            <Text style={styles.textButton}>CALL</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

export default MainScreen;
