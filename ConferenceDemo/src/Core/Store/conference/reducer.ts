/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import {
  AvailableDevice,
  IParticipant,
  IReduxAction,
} from '../../../Utils/types';
import {conferenceActions} from './actionTypes';

export interface IConferenceReducer {
  participants: IParticipant[];
  callState: string;
  isMuted: boolean;
  isSendVideo: boolean;
  selectedAudioDevice: AvailableDevice | null;
  listAudioDevices: Array<string>;
  error: string;
}

const initialState = {
  participants: [],
  callState: 'Disconnected',
  isMuted: false,
  isSendVideo: false,
  selectedAudioDevice: null,
  listAudioDevices: [],
  error: '',
};

const conferenceReducer = (
  state = initialState,
  action: IReduxAction,
): IConferenceReducer => {
  const {type, payload} = action;
  switch (type) {
    case conferenceActions.TOGGLE_MUTE: {
      return {...state, isMuted: !state.isMuted};
    }
    case conferenceActions.TOGGLE_SEND_VIDEO: {
      return {...state, isSendVideo: !state.isSendVideo};
    }
    case conferenceActions.CHANGE_CALL_STATE: {
      return {...state, callState: payload};
    }
    case conferenceActions.VIDEO_STREAM_ADDED: {
      return {
        ...state,
        participants: state.participants.map((el: IParticipant) =>
          el.id === payload.id ? {...el, streamId: payload.streamId} : el,
        ),
      };
    }
    case conferenceActions.VIDEO_STREAM_REMOVED: {
      return {
        ...state,
        participants: state.participants.map((el: IParticipant) =>
          el.id === payload.id ? {...el, streamId: ''} : el,
        ),
      };
    }
    case conferenceActions.ENDPOINT_ADDED: {
      return {...state, participants: [...state.participants, payload]};
    }
    case conferenceActions.ENDPOINT_REMOVED: {
      return {
        ...state,
        participants: state.participants.filter(
          (item: IParticipant) => item.id !== payload.id,
        ),
      };
    }
    case conferenceActions.SET_ERROR: {
      return {...state, error: payload};
    }
    case conferenceActions.RESET_CALL_STATE: {
      return {...state, participants: [], isMuted: false, isSendVideo: false};
    }
    case conferenceActions.ENDPOINT_VOICE_ACTIVITY_STARTED: {
      return {
        ...state,
        participants: state.participants.map((el: IParticipant) =>
          el.id === payload.id ? {...el, isActiveVoice: true} : el,
        ),
      };
    }
    case conferenceActions.ENDPOINT_VOICE_ACTIVITY_STOPPED: {
      return {
        ...state,
        participants: state.participants.map((el: IParticipant) =>
          el.id === payload.id ? {...el, isActiveVoice: false} : el,
        ),
      };
    }
    case conferenceActions.ENDPOINT_MUTED: {
      return {
        ...state,
        participants: state.participants.map((el: IParticipant) =>
          el.id === payload.id ? {...el, isMuted: payload.isMuted} : el,
        ),
      };
    }
    case conferenceActions.SET_SELECTED_AUDIO_DEVICE: {
      return {...state, selectedAudioDevice: payload};
    }
    case conferenceActions.SET_LIST_AUDIO_DEVICES: {
      return {...state, listAudioDevices: payload};
    }
    case conferenceActions.MANAGE_PARTICIPANT_STREAM: {
      return {
        ...state,
        participants: state.participants.map((el: IParticipant) =>
          el.id === payload.id
            ? {...el, hasEnabledStream: payload.hasEnabledStream}
            : el,
        ),
      };
    }
    default:
      return state;
  }
};

export default conferenceReducer;
