/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import { IParticipant, IReduxAction } from "../../../Utils/types";
import { conferenceActions } from "./actionTypes";

export interface IConferenceReducer {
  participants: IParticipant[];
  callState: string;
  isMuted: boolean;
  sendLocalVideo: boolean;
  error: string;
}

const initialState = {
  participants: [],
  callState: 'Disconnected',
  isMuted: false,
  sendLocalVideo: false,
  error: '',
};

const conferenceReducer = (state = initialState, action: IReduxAction): IConferenceReducer => {
  const { type, payload } = action;
  switch(type) {
    case conferenceActions.TOGGLE_IS_MUTED: {
      return { ...state, isMuted: !state.isMuted };
    }
    case conferenceActions.TOGGLE_LOCAL_VIDEO: {
      return { ...state, sendLocalVideo: !state.sendLocalVideo };
    }
    case conferenceActions.CHANGE_CALL_STATE: {
      return { ...state, callState: payload }
    }
    case conferenceActions.ADD_PARTICIPANT: {
      return { ...state, participants: [ ...state.participants, payload ]};
    }
    case conferenceActions.LOCAL_VIDEO_STREAM_ADDED: {
      return {...state, participants: 
        state.participants.map((el: IParticipant) => el.id === payload.id ? {...el, streamId: payload.streamId} : el)}
    }
    case conferenceActions.LOCAL_VIDEO_STREAM_REMOVED: {
      return {...state, participants: 
        state.participants.map((el: IParticipant) => el.id === payload.id ? {...el, streamId: ''} : el)}
    }
    case conferenceActions.ENDPOINT_ADDED: {
      return { ...state, participants: [ ...state.participants, payload ]};
    }
    case conferenceActions.REMOTE_VIDEO_STREAM_ADDED: {
      return {...state, participants: 
        state.participants.map((el: IParticipant) => el.id === payload.id ? {...el, streamId: payload.streamId} : el)}
    }
    case conferenceActions.REMOTE_VIDEO_STREAM_REMOVED: {
      return {...state, participants: 
        state.participants.map((el: IParticipant) => el.id === payload.id ? {...el, streamId: ''} : el)}
    }
    case conferenceActions.ENDPOINT_REMOVED: {
      return { ...state, participants: 
        state.participants.filter((item: IParticipant) => item.id !== payload.id) };
    }
    case conferenceActions.SET_ERROR: {
      return { ...state, error: payload }
    }
    case conferenceActions.REMOVE_ALL_PARTICIPANTS: {
      return { ...state, participants: [] }
    }
    case conferenceActions.ENDPOINT_VOICE_ACTIVITY_STARTED: {
      return {...state, participants: 
        state.participants.map((el: IParticipant) => el.id === payload.id ? {...el, isActiveVoice: true} : el)}
    }
    case conferenceActions.ENDPOINT_VOICE_ACTIVITY_STOPPED: {
      return {...state, participants: 
        state.participants.map((el: IParticipant) => el.id === payload.id ? {...el, isActiveVoice: false} : el)}
    }
    case conferenceActions.ENDPOINT_MUTED: {
      return {...state, participants: 
        state.participants.map((el: IParticipant) => el.id === payload.id ? {...el, isMuted: payload.isMuted} : el)}
    }
    default:
      return state;
  }
};

export default conferenceReducer;