import {useNavigation} from '@react-navigation/native';
import React, {useState, useRef, useCallback, useEffect} from 'react';
import {
  Alert,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './Styles';
import {Voximplant} from 'react-native-voximplant';
import calls from './Store';

const CallScreen = ({route}) => {
  const navigation = useNavigation();
  const {isIncomingCall, isVideoCall, callee} = route.params;
  const [callState, setCallState] = useState('Connecting');
  const callId = useRef(route.params.callId);
  const [localVideoStreamId, setLocalVideoStreamId] = useState('');
  const [remoteVideoStreamId, setRemoteVideoStreamId] = useState('');
  const voximplant = Voximplant.getInstance();

  useEffect(() => {
    let callSettings = {
      video: {
        sendVideo: isVideoCall,
        receiveVideo: isVideoCall,
      },
    };

    let call;
    let endpoint;
    async function makeCall() {
      call = await voximplant.call(callee, callSettings);
      subscribeToCallEvents();
      callId.current = call.callId;
      calls.set(call.callId, call);
    }

    async function answerCall() {
      call = calls.get(callId.current);
      subscribeToCallEvents();
      endpoint = call.getEndpoints()[0];
      subscribeToEndpointEvents();
      await call.answer(callSettings);
    }

    function subscribeToCallEvents() {
      call.on(Voximplant.CallEvents.Connected, (callEvent) => {
        setCallState('Call connected');
      });
      call.on(Voximplant.CallEvents.Disconnected, (callEvent) => {
        calls.delete(callEvent.call.callId);
        navigation.navigate('Main');
      });
      call.on(Voximplant.CallEvents.Failed, (callEvent) => {
        showCallError(callEvent.reason);
      });
      call.on(Voximplant.CallEvents.ProgressToneStart, (callEvent) => {
        setCallState('Ringing...');
      });
      call.on(Voximplant.CallEvents.LocalVideoStreamAdded, (callEvent) => {
        setLocalVideoStreamId(callEvent.videoStream.id);
      });
      call.on(Voximplant.CallEvents.EndpointAdded, (callEvent) => {
        console.log('endpoint added');
        endpoint = callEvent.endpoint;
        subscribeToEndpointEvents();
      });
    }

    function subscribeToEndpointEvents() {
      endpoint.on(
        Voximplant.EndpointEvents.RemoteVideoStreamAdded,
        (endpointEvent) => {
          setRemoteVideoStreamId(endpointEvent.videoStream.id);
        },
      );
    }

    function showCallError(reason) {
      Alert.alert('Call failed', `Reason: ${reason}`, [
        {
          text: 'OK',
          onPress: () => {
            calls.delete(callId.current);
            navigation.navigate('Main');
          },
        },
      ]);
    }

    if (isIncomingCall) {
      answerCall();
    } else {
      makeCall();
    }

    return function cleanup() {
      call.off(Voximplant.CallEvents.Connected);
      call.off(Voximplant.CallEvents.Disconnected);
      call.off(Voximplant.CallEvents.Failed);
      call.off(Voximplant.CallEvents.ProgressToneStart);
      call.off(Voximplant.CallEvents.LocalVideoStreamAdded);
      call.off(Voximplant.CallEvents.EndpointAdded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVideoCall]);

  const endCall = useCallback(() => {
    let call = calls.get(callId.current);
    call.hangup();
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safearea}>
        <View style={styles.videoPanel}>
          <Voximplant.VideoView
            style={styles.remotevideo}
            videoStreamId={remoteVideoStreamId}
            scaleType={Voximplant.RenderScaleType.SCALE_FIT}
          />
          <Voximplant.VideoView
            style={styles.selfview}
            videoStreamId={localVideoStreamId}
            scaleType={Voximplant.RenderScaleType.SCALE_FIT}
            showOnTop={true}
          />
        </View>
        <View style={styles.callControlsVideo}>
          <Text style={styles.callConnectingLabel}>{callState}</Text>
          <TouchableOpacity onPress={() => endCall()} style={styles.button}>
            <Text style={styles.textButton}>END CALL</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

export default CallScreen;
