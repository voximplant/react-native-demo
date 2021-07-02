import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './Styles';
import calls from './Store';
import {Voximplant} from 'react-native-voximplant';

const IncomingCallScreen = ({route}) => {
  const navigation = useNavigation();
  const {callId} = route.params;
  const [caller, setCaller] = useState('Unknown');

  useEffect(() => {
    let call = calls.get(callId);
    setCaller(call.getEndpoints()[0].displayName);
    call.on(Voximplant.CallEvents.Disconnected, (callEvent) => {
      calls.delete(callEvent.call.callId);
      navigation.navigate('Main');
    });
    return function cleanup() {
      call.off(Voximplant.CallEvents.Disconnected);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callId]);

  async function answerCall(isVideoCall) {
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
        callId: callId,
        isIncomingCall: true,
      });
    } catch (e) {
      console.warn(`MainScreen: makeCall failed: ${e}`);
    }
  }

  async function declineCall() {
    let call = calls.get(callId);
    call.decline();
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safearea}>
        <View style={styles.container}>
          <Text style={styles.incomingCallText}>Incoming call from:</Text>
          <Text style={styles.incomingCallText}>{caller}</Text>
          <View style={styles.incomingCallButtons}>
            <TouchableOpacity
              onPress={() => answerCall(true)}
              style={styles.button}>
              <Text style={styles.textButton}>ANSWER</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => declineCall()}
              style={styles.button}>
              <Text style={styles.textButton}>DECLINE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default IncomingCallScreen;
