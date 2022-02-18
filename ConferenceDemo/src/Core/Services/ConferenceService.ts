/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import { useRef } from 'react';
//@ts-ignore
import {Voximplant} from 'react-native-voximplant';
import { useDispatch } from 'react-redux';

import { useUtils } from '../../Utils/useUtils';

import { callFailed, changeCallState, removeParticipant, toggleIsLocalVideo, updateParticipants } from '../Store/conference/actions';

export const ConferenceService = () => {
  const client = Voximplant.getInstance();
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
      const model = convertParticitantModel({id: callEvent.call.callId});
      dispatch(updateParticipants(model));
      dispatch(changeCallState({callState: 'Connected'}));
      // TODO: bug localvideo is active before call started, and streamId rewrited empty string
    });
    currentConference.current?.on(Voximplant.CallEvents.Disconnected, (callEvent: any) => {
      const model = convertParticitantModel({id: callEvent.call.callId});
      dispatch(changeCallState({callState: 'Disconnected', participants: []}));
      unsubscribeFromConferenceEvents();
      currentConference.current = null;
    });
    currentConference.current?.on(Voximplant.CallEvents.Failed, (callEvent: any) => {
      dispatch(callFailed({callState: 'Failed', reason: callEvent.reason}));
      unsubscribeFromConferenceEvents();
    });
    currentConference.current?.on(Voximplant.CallEvents.LocalVideoStreamAdded, (callEvent: any) => {
      const model = convertParticitantModel({id: callEvent.call.callId, streamId: callEvent.videoStream.id});
      dispatch(updateParticipants(model));
    });
    currentConference.current?.on(Voximplant.CallEvents.LocalVideoStreamRemoved, (callEvent: any) => {
      const model = convertParticitantModel({id: callEvent.call.callId, streamId: ''});
      dispatch(updateParticipants(model));
    });
    currentConference.current?.on(Voximplant.CallEvents.EndpointAdded, (callEvent: any) => {
      if (currentConference.current?.callId !== callEvent.endpoint.id) {
        subscribeToEndpointEvents(callEvent.endpoint);
      }
    });
  }

  const subscribeToEndpointEvents = (endpoint: Voximplant.Endpoint) => {
    endpoint.on(
      Voximplant.EndpointEvents.RemoteVideoStreamAdded,
      (endpointEvent: any) => {
        const model = convertParticitantModel({id: endpointEvent.endpoint.id, streamId: endpointEvent.videoStream.id});
        dispatch(updateParticipants(model));
      },
    );
    endpoint.on(
      Voximplant.EndpointEvents.RemoteVideoStreamRemoved,
      (endpointEvent: any) => {
        const model = convertParticitantModel({id: endpointEvent.endpoint.id, streamId: ''});
        dispatch(updateParticipants(model));
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
    try {
      await currentConference.current.sendVideo(isSendVideo);
      dispatch(toggleIsLocalVideo());
    } catch (error) {
      console.log('[ConferenceService]:[ERROR] => sendLocalVideo method');
    }
  };

  return {
    startConference,
    endConference,
    currentConference,
    muteAudio,
    sendLocalVideo,
  };
};