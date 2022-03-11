/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import {useRef} from 'react';
//@ts-ignore
import {Voximplant} from 'react-native-voximplant';
import {useDispatch, useSelector} from 'react-redux';

import {IParticipant} from '../../Utils/types';
import {useUtils} from '../../Utils/useUtils';
import {RootReducer} from '../Store';

import {
  changeCallState,
  videoStreamAdded,
  videoStreamRemoved,
  endpointAdded,
  endpointRemoved,
  setError,
  removeAllParticipants,
  endpointVoiceActivityStarted,
  endpointVoiceActivityStopped,
  endpointMuted,
  manageParticipantStream,
} from '../Store/conference/actions';

export const ConferenceService = () => {
  const Client = Voximplant.getInstance();

  const user = useSelector((state: RootReducer) => state.loginReducer.user);
  const dispatch = useDispatch();
  const {convertParticitantModel} = useUtils();

  const currentConference = useRef<Voximplant.Call>();

  const startConference = async (conference: string, localVideo: boolean) => {
    const callSettings = {
      enableSimulcast: true,
      video: {
        sendVideo: localVideo,
        receiveVideo: true,
      },
    };
    currentConference.current = await Client.callConference(
      conference,
      callSettings,
    );
    const model = convertParticitantModel({
      id: currentConference.current?.callId,
      name: user,
    });
    dispatch(endpointAdded(model));
    subscribeToConferenceEvents();
  };

  const disableRemoteStream = async (
    endpoint: Voximplant.Endpoint,
    streamId: string,
  ) => {
    await endpoint.stopReceiving(streamId);
  };

  const enableRemoteStream = async (
    endpoint: Voximplant.Endpoint,
    streamId: string,
  ) => {
    await endpoint.startReceiving(streamId);
  };

  const unsubscribeFromConferenceEvents = () => {
    currentConference.current?.off();
  };

  const unsubscribeFromEndpointEvents = (endpoint: Voximplant.Endpoint) => {
    endpoint?.off();
  };

  const hangUp = () => {
    currentConference.current?.hangup();
  };

  const muteAudio = (isMuted: boolean) => {
    currentConference.current?.sendAudio(isMuted);
    currentConference.current?.sendMessage(JSON.stringify({muted: !isMuted}));
  };

  const sendLocalVideo = async (isSendVideo: boolean) => {
    await currentConference.current.sendVideo(isSendVideo);
  };

  const streamManager = async (
    count: number,
    participant: IParticipant,
    index: number,
  ) => {
    const endpoints = currentConference.current?.getEndpoints();
    const findedEndoint = endpoints?.find(
      (endpoint: Voximplant.Endpoint) => endpoint.id === participant.id,
    );
    if (
      !findedEndoint ||
      !participant.streamId ||
      currentConference.current.callId === participant.id
    ) {
      return;
    }
    if (count >= 6) {
      if (index <= 5) {
        if (!participant.isEnabledStream) {
          await enableRemoteStream(findedEndoint, participant.streamId);
          const model = convertParticitantModel({
            id: participant.id,
            isEnabledStream: true,
          });
          dispatch(manageParticipantStream(model));
        }
      } else {
        if (participant.isEnabledStream) {
          await disableRemoteStream(findedEndoint, participant.streamId);
          const model = convertParticitantModel({
            id: participant.id,
            isEnabledStream: false,
          });
          dispatch(manageParticipantStream(model));
        }
      }
    }
  };

  const subscribeToConferenceEvents = () => {
    currentConference.current?.on(Voximplant.CallEvents.Connected, () => {
      dispatch(changeCallState('Connected'));
    });
    currentConference.current?.on(Voximplant.CallEvents.Disconnected, () => {
      dispatch(changeCallState('Disconnected'));
      dispatch(removeAllParticipants());
      unsubscribeFromConferenceEvents();
      currentConference.current = null;
    });
    currentConference.current?.on(
      Voximplant.CallEvents.Failed,
      (callEvent: any) => {
        dispatch(changeCallState('Failed'));
        dispatch(setError(callEvent.reason));
        unsubscribeFromConferenceEvents();
      },
    );
    currentConference.current?.on(
      Voximplant.CallEvents.LocalVideoStreamAdded,
      (callEvent: any) => {
        const model = convertParticitantModel({
          id: callEvent.call.callId,
          name: user,
          streamId: callEvent.videoStream.id,
        });
        dispatch(videoStreamAdded(model));
      },
    );
    currentConference.current?.on(
      Voximplant.CallEvents.LocalVideoStreamRemoved,
      (callEvent: any) => {
        const model = convertParticitantModel({id: callEvent.call.callId});
        dispatch(videoStreamRemoved(model));
      },
    );
    currentConference.current?.on(
      Voximplant.CallEvents.EndpointAdded,
      (callEvent: any) => {
        if (currentConference.current?.callId !== callEvent.endpoint.id) {
          const model = convertParticitantModel({
            id: callEvent.endpoint.id,
            name: callEvent.displayName,
          });
          dispatch(endpointAdded(model));
          subscribeToEndpointEvents(callEvent.endpoint);
        }
      },
    );
    currentConference.current?.on(
      Voximplant.CallEvents.MessageReceived,
      (callEvent: any) => {
        try {
          const message = JSON.parse(callEvent.text);
          const model = convertParticitantModel({
            id: message.id,
            isMuted: message.isMuted,
          });
          dispatch(endpointMuted(model));
        } catch (error) {
          console.log('JSON.parse [ERROR]: MessageReceived =>', callEvent.text);
        }
      },
    );
  };

  const subscribeToEndpointEvents = (endpoint: Voximplant.Endpoint) => {
    endpoint.on(
      Voximplant.EndpointEvents.RemoteVideoStreamAdded,
      (endpointEvent: any) => {
        const model = convertParticitantModel({
          id: endpointEvent.endpoint.id,
          streamId: endpointEvent.videoStream.id,
        });
        dispatch(videoStreamAdded(model));
      },
    );
    endpoint.on(
      Voximplant.EndpointEvents.RemoteVideoStreamRemoved,
      (endpointEvent: any) => {
        const model = convertParticitantModel({id: endpointEvent.endpoint.id});
        dispatch(videoStreamRemoved(model));
      },
    );
    endpoint.on(
      Voximplant.EndpointEvents.VoiceActivityStarted,
      (endpointEvent: any) => {
        const model = convertParticitantModel({id: endpointEvent.endpoint.id});
        dispatch(endpointVoiceActivityStarted(model));
      },
    );
    endpoint.on(
      Voximplant.EndpointEvents.VoiceActivityStopped,
      (endpointEvent: any) => {
        const model = convertParticitantModel({id: endpointEvent.endpoint.id});
        dispatch(endpointVoiceActivityStopped(model));
      },
    );
    endpoint.on(Voximplant.EndpointEvents.Removed, (endpointEvent: any) => {
      const model = convertParticitantModel({id: endpointEvent.endpoint.id});
      dispatch(endpointRemoved(model));
      unsubscribeFromEndpointEvents(endpointEvent.enpoint);
    });
  };

  return {
    startConference,
    hangUp,
    muteAudio,
    sendLocalVideo,
    streamManager,
  };
};
