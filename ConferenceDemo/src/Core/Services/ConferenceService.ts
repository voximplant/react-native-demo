/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import { useRef } from 'react';
//@ts-ignore
import {Voximplant} from 'react-native-voximplant';
import { useDispatch } from 'react-redux';

import { useUtils } from '../../Utils/useUtils';
import { RootReducer, store } from '../Store';

import {
  changeCallState,
  removeVideoStreamAdded,
  removeVideoStreamRemoved,
  addParticipant,
  localVideoStreamAdded,
  localVideoStreamRemoved,
  endpointAdded,
  endpointRemoved,
  setError,
  removeAllParticipants,
  endpointVoiceActivityStarted,
  endpointVoiceActivityStopped,
} from '../Store/conference/actions';

export const ConferenceService = () => {
  const client = Voximplant.getInstance();
  const { loginReducer: { user } }: RootReducer = store.getState();

  const dispatch = useDispatch();
  const { convertParticitantModel } = useUtils();

  const currentConference = useRef<Voximplant.Call>();

  const startConference = async (conference: string, localVideo: boolean) => {
    const callSettings = {
      video: {
        sendVideo: localVideo,
        receiveVideo: true,
      },
    };
    currentConference.current = await client.callConference(conference, callSettings);
    const model = convertParticitantModel({id: currentConference.current?.callId, name: user});
    dispatch(addParticipant(model));
    subscribeToConferenceEvents();
  }

  const subscribeToConferenceEvents = () => {
    currentConference.current?.on(Voximplant.CallEvents.Connected, (callEvent: any) => {
      dispatch(changeCallState('Connected'));
    });
    currentConference.current?.on(Voximplant.CallEvents.Disconnected, (callEvent: any) => {
      dispatch(changeCallState('Disconnected'));
      dispatch(removeAllParticipants());
      unsubscribeFromConferenceEvents();
      currentConference.current = null;
    });
    currentConference.current?.on(Voximplant.CallEvents.Failed, (callEvent: any) => {
      dispatch(changeCallState('Failed'));
      dispatch(setError(callEvent.reason));
      unsubscribeFromConferenceEvents();
    });
    currentConference.current?.on(Voximplant.CallEvents.LocalVideoStreamAdded, (callEvent: any) => {
      const model = convertParticitantModel({id: callEvent.call.callId, name: user, streamId: callEvent.videoStream.id});
      dispatch(localVideoStreamAdded(model));
    });
    currentConference.current?.on(Voximplant.CallEvents.LocalVideoStreamRemoved, (callEvent: any) => {
      const model = convertParticitantModel({id: callEvent.call.callId, name: user, streamId: ''});
      dispatch(localVideoStreamRemoved(model));
    });
    currentConference.current?.on(Voximplant.CallEvents.EndpointAdded, (callEvent: any) => {
      if (currentConference.current?.callId !== callEvent.endpoint.id) {
        const model = convertParticitantModel({id: callEvent.endpoint.id, name: callEvent.displayName, streamId: ''});
        dispatch(endpointAdded(model))
        subscribeToEndpointEvents(callEvent.endpoint);
      }
    });
  }

  const subscribeToEndpointEvents = (endpoint: Voximplant.Endpoint) => {
    endpoint.on(
      Voximplant.EndpointEvents.RemoteVideoStreamAdded,
      (endpointEvent: any) => {
        const model = convertParticitantModel({id: endpointEvent.endpoint.id, streamId: endpointEvent.videoStream.id});
        dispatch(removeVideoStreamAdded(model));
      },
    );
    endpoint.on(
      Voximplant.EndpointEvents.RemoteVideoStreamRemoved,
      (endpointEvent: any) => {
        const model = convertParticitantModel({id: endpointEvent.endpoint.id});
        dispatch(removeVideoStreamRemoved(model));
      },
    );
    endpoint.on(
      Voximplant.EndpointEvents.VoiceActivityStarted,
      (endpointEvent: any) => {
        const model = convertParticitantModel({id: endpointEvent.endpoint.id});
        dispatch(endpointVoiceActivityStarted(model));
      }
    );
    endpoint.on(
      Voximplant.EndpointEvents.VoiceActivityStopped,
      (endpointEvent: any) => {
        const model = convertParticitantModel({id: endpointEvent.endpoint.id});
        dispatch(endpointVoiceActivityStopped(model));
      }
    );
    endpoint.on(
      Voximplant.EndpointEvents.Removed,
      (endpointEvent: any) => {
        const model = convertParticitantModel({ id: endpointEvent.endpoint.id });
        dispatch(endpointRemoved(model));
        // unsubscribeFromEndpointEvents(endpointEvent.enpoint) // ?? check endpoint instance
      },
    );
  }

  const unsubscribeFromConferenceEvents = () => {
    currentConference.current?.off(Voximplant.CallEvents.Connected);
    currentConference.current?.off(Voximplant.CallEvents.Disconnected);
    currentConference.current?.off(Voximplant.CallEvents.Failed);
    currentConference.current?.off(Voximplant.CallEvents.ProgressToneStart);
    currentConference.current?.off(Voximplant.CallEvents.LocalVideoStreamAdded);
    currentConference.current?.off(Voximplant.CallEvents.EndpointAdded);
  };

  const unsubscribeFromEndpointEvents = (endpoint: Voximplant.Endpoint) => {
    endpoint.off(Voximplant.EndpointEvents.RemoteVideoStreamAdded);
    endpoint.off(Voximplant.EndpointEvents.RemoteVideoStreamRemoved);
    endpoint.off(Voximplant.EndpointEvents.Removed);
  };

  const endConference = () => {
    hangUp();
  };

  const hangUp = () => {
    currentConference.current?.hangup();
  };

  const muteAudio = (isMuted: boolean) => {
    currentConference.current.sendAudio(isMuted);
  };

  const sendLocalVideo = async (isSendVideo: boolean) => {
    await currentConference.current.sendVideo(isSendVideo);
  };

  return {
    startConference,
    endConference,
    muteAudio,
    sendLocalVideo,
  };
};