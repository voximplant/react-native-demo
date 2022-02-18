/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import { useRef } from 'react';
//@ts-ignore
import {Voximplant} from 'react-native-voximplant';
import { useDispatch } from 'react-redux';

import { useUtils } from '../../Utils/useUtils';
import { store } from '../Store';

import {
  callFailed,
  changeCallState,
  removeVideoStreamAdded,
  removeVideoStreamRemoved,
  addParticipant,
  localVideoStreamAdded,
  localVideoStreamRemoved,
  endpointAdded,
  endpointRemoved,
  toggleIsLocalVideo,
} from '../Store/conference/actions';

export const ConferenceService = () => {
  const client = Voximplant.getInstance();
  const userName = store.getState().loginReducer?.user;

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
    subscribeToConferenceEvents();
  }

  const subscribeToConferenceEvents = () => {
    currentConference.current?.on(Voximplant.CallEvents.Connected, (callEvent: any) => {
      dispatch(changeCallState({callState: 'Connected', participants: []}));
      const model = convertParticitantModel({id: callEvent.call.callId, name: userName, streamId: ''});
      dispatch(addParticipant(model));
    });
    currentConference.current?.on(Voximplant.CallEvents.Disconnected, (callEvent: any) => {
      dispatch(changeCallState({callState: 'Disconnected', participants: []}));
      unsubscribeFromConferenceEvents();
      currentConference.current = null;
    });
    currentConference.current?.on(Voximplant.CallEvents.Failed, (callEvent: any) => {
      dispatch(callFailed({callState: 'Failed', reason: callEvent.reason}));
      unsubscribeFromConferenceEvents();
    });
    currentConference.current?.on(Voximplant.CallEvents.LocalVideoStreamAdded, (callEvent: any) => {
      const model = convertParticitantModel({id: callEvent.call.callId, name: userName, streamId: callEvent.videoStream.id});
      dispatch(localVideoStreamAdded(model));
    });
    currentConference.current?.on(Voximplant.CallEvents.LocalVideoStreamRemoved, (callEvent: any) => {
      const model = convertParticitantModel({id: callEvent.call.callId, name: userName, streamId: ''});
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
        dispatch(removeVideoStreamAdded({id: endpointEvent.endpoint.id, streamId: endpointEvent.videoStream.id}));
      },
    );
    endpoint.on(
      Voximplant.EndpointEvents.RemoteVideoStreamRemoved,
      (endpointEvent: any) => {
        dispatch(removeVideoStreamRemoved({id: endpointEvent.endpoint.id}));
      },
    );
    endpoint.on(
      Voximplant.EndpointEvents.Removed,
      (endpointEvent: any) => {
        const model = convertParticitantModel({ id: endpointEvent.endpoint.id });
        dispatch(endpointRemoved(model));
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