/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import { useNavigation } from '@react-navigation/native';
import { useRef, useState } from 'react';
//@ts-ignore
import {Voximplant} from 'react-native-voximplant';
import { useDispatch } from 'react-redux';
import { ScreenNavigationProp } from '../../Utils/types';

import { useUtils } from '../../Utils/useUtils';

import { addParticipant, changeCallState, removeParticipant, updateParticipant } from '../Store/conference/actions';

export const ConferenceService = () => {
  const client = Voximplant.getInstance();

  const dispatch = useDispatch();
  const { convertParticitantModel } = useUtils();

  const navigation = useNavigation<ScreenNavigationProp<'Main'>>();
  const currentConference = useRef<Voximplant.Call>();

  const [isMuted, setIsMuted] = useState(false);

  const startConference = async (conference: string, localVideo: boolean) => {
    const callSettings = {
      video: {
        sendVideo: localVideo,
        receiveVideo: true,
      },
    };
    currentConference.current = await client.callConference(conference, callSettings);
    subscribeToConferenceEvents();
  }


  const subscribeToConferenceEvents = () => {
    currentConference.current?.on(Voximplant.CallEvents.Connected, (callEvent: any) => {
      dispatch(changeCallState('Connected'));
    });
    currentConference.current?.on(Voximplant.CallEvents.Disconnected, (callEvent: any) => {
      endConference();
    });
    currentConference.current?.on(Voximplant.CallEvents.Failed, (callEvent: any) => {
      unsubscribeToConferenceEvents();
      // TODO: dispatch(callFailed(callEvent.reason));
    });
    currentConference.current?.on(Voximplant.CallEvents.LocalVideoStreamAdded, (callEvent: any) => {
      const model = convertParticitantModel({id: callEvent.call.callId, streamId: callEvent.videoStream.id});
      dispatch(addParticipant(model));
    });
    currentConference.current?.on(Voximplant.CallEvents.LocalVideoStreamRemoved, (callEvent: any) => {
      const model = convertParticitantModel({id: callEvent.call.callId, streamId: ''});
      dispatch(updateParticipant(model));
    });
    currentConference.current?.on(Voximplant.CallEvents.EndpointAdded, (callEvent: any) => {
      if (callEvent.call.callId !== callEvent.endpoint.id) {
        subscribeToEndpointEvents(callEvent.endpoint);
      }
    });
  }

  const subscribeToEndpointEvents = (endpoint: Voximplant.Endpoint) => {
    endpoint.on(
      Voximplant.EndpointEvents.RemoteVideoStreamAdded,
      (endpointEvent: any) => {
        const model = convertParticitantModel({id: endpointEvent.endpoint.id, streamId: endpointEvent.videoStream.id});
        dispatch(addParticipant(model));
      },
    );
    endpoint.on(
      Voximplant.EndpointEvents.RemoteVideoStreamRemoved,
      (endpointEvent: any) => {
        const model = convertParticitantModel({id: endpointEvent.endpoint.id, streamId: endpointEvent.videoStream.id});
        dispatch(updateParticipant(model));
      },
    );
    endpoint.on(
      Voximplant.EndpointEvents.Removed,
      (endpointEvent: any) => {
        const model = convertParticitantModel({ id: endpointEvent.endpoint.id });
        dispatch(removeParticipant(model));
      },
    );
  }

  const unsubscribeToConferenceEvents = () => {
    currentConference.current?.off(Voximplant.CallEvents.Connected);
    currentConference.current?.off(Voximplant.CallEvents.Disconnected);
    currentConference.current?.off(Voximplant.CallEvents.Failed);
    currentConference.current?.off(Voximplant.CallEvents.ProgressToneStart);
    currentConference.current?.off(Voximplant.CallEvents.LocalVideoStreamAdded);
    currentConference.current?.off(Voximplant.CallEvents.EndpointAdded);
  };

  const endConference = () => {
    hangUp();
    unsubscribeToConferenceEvents();
    currentConference.current = null;
    navigation.navigate('Main');
  };

  const hangUp = () => {
    currentConference.current?.hangup();
  };

  const muteAudio = () => {
    currentConference.current.sendAudio(isMuted);
    setIsMuted(!isMuted);
  };

  return {
    startConference,
    endConference,
    currentConference,
    muteAudio,
    isMuted,
  };
};