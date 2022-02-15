/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import { useNavigation } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
//@ts-ignore
import {Voximplant} from 'react-native-voximplant';
import { useDispatch } from 'react-redux';

import { useUtils } from '../../Utils/useUtils';

import { callFailed, changeCallState } from '../Store/conference/actions';

export const CallService = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const client = Voximplant.getInstance();
  const { checkAndroidCameraPermission, isIOS } = useUtils();

  // const endpoint = useRef<Voximplant.Endpoint>();
  const currentConference = useRef<Voximplant.Call>();

  const [localVideoStreamId, setLocalVideoStreamId] = useState('');
  let remoteVideoStreamIds: string[] = [];
  const [isMuted, setIsMuted] = useState(false);

  const startConference = async (conference: string, localVideo: boolean) => {
    const callSettings = {
      video: {
        sendVideo: localVideo,
        receiveVideo: true,
      },
    };
    currentConference.current = await client.callConference(conference, callSettings);
    subscribeToCallEvents();
  }


  const subscribeToCallEvents = () => {
    currentConference.current?.on(Voximplant.CallEvents.Connected, (callEvent: any) => {
      console.log('Connected =========>', callEvent);
      dispatch(changeCallState('Connected'));
    });
    currentConference.current?.on(Voximplant.CallEvents.Disconnected, (callEvent: any) => {
      console.log('Disconnected =========>', callEvent);
      currentConference.current = null;
      endConference();
      navigation.navigate('Main');
    });
    currentConference.current?.on(Voximplant.CallEvents.Failed, (callEvent: any) => {
      console.log('Failed =========>', callEvent);
      dispatch(callFailed(callEvent.reason));
    });
    currentConference.current?.on(Voximplant.CallEvents.ProgressToneStart, (callEvent: any) => {
      console.log('ProgressToneStart =========>', callEvent);
      dispatch(changeCallState('Ringing ...'));
    });
    currentConference.current?.on(Voximplant.CallEvents.LocalVideoStreamAdded, (callEvent: any) => {
      console.log('LocalVideoStreamAdded ========>', callEvent);
      setLocalVideoStreamId(callEvent.videoStream.id);
    });
    currentConference.current?.on(Voximplant.CallEvents.EndpointAdded, (callEvent: any) => {
      console.log('EndpointAdded =========>', callEvent);
      subscribeToEndpointEvents(callEvent.endpoint);
    });
  }

  const subscribeToEndpointEvents = (endpoint) => {
    endpoint.on(
      Voximplant.EndpointEvents.RemoteVideoStreamAdded,
      (endpointEvent: any) => {
        console.log('RemoteVideoStreamAdded =========>', endpointEvent);
        remoteVideoStreamIds.push(endpointEvent.videoStream.id);
      },
    );
    endpoint.on(
      Voximplant.EndpointEvents.RemoteVideoStreamRemoved,
      (endpointEvent: any) => {
        // console.log('RemoteVideoStreamRemoved =========>', endpointEvent);
        const filtred = remoteVideoStreamIds?.filter((el) => el === endpointEvent.videoStream.id);
        console.log('RemoteVideoStreamRemoved =========>', filtred);
        remoteVideoStreamIds = filtred;
      },
    );
  }

  const endConference = () => {
    currentConference.current?.off(Voximplant.CallEvents.Connected);
    currentConference.current?.off(Voximplant.CallEvents.Disconnected);
    currentConference.current?.off(Voximplant.CallEvents.Failed);
    currentConference.current?.off(Voximplant.CallEvents.ProgressToneStart);
    currentConference.current?.off(Voximplant.CallEvents.LocalVideoStreamAdded);
    currentConference.current?.off(Voximplant.CallEvents.EndpointAdded);
    currentConference.current?.hangup();
    navigation.navigate('Main');
  };

  const muteAudio = () => {
    currentConference.current.sendAudio(!isMuted);
    setIsMuted(!isMuted);
  };

  const sendVideo = async (localVideo: boolean) => {
    try {
      // if (isSendVideo && !isIOS) {
      //   checkAndroidCameraPermission;
      // }
      currentConference.current.sendVideo(!localVideo);
      !localVideo && setLocalVideoStreamId('');
    } catch (e) {
        console.warn(`Failed to sendVideo ${e}`);
    }
}

  return {
    startConference,
    endConference,
    localVideoStreamId,
    currentConference,
    muteAudio,
    isMuted,
    sendVideo,
    remoteVideoStreamIds,
  };
};