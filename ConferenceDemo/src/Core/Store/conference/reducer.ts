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
    case conferenceActions.TOGGLE_MUTE: {
      return { ...state, isMuted: !state.isMuted };
    }
    case conferenceActions.TOGGLE_SEND_VIDEO: {
      return { ...state, sendLocalVideo: !state.sendLocalVideo };
    }
    case conferenceActions.CHANGE_CALL_STATE: {
      return { ...state, callState: payload }
    }
    case conferenceActions.ADD_PARTICIPANT: {
      return { ...state, participants: [ ...state.participants, payload ]};
    }
    case conferenceActions.LOCAL_VIDEO_STREAM_ADDED: {
      const index = state.participants.findIndex((el: IParticipant) => el.id === payload.id);
      const newTarget = {...(state.participants as IParticipant[])[index], streamId: payload.streamId}
      state.participants.splice(index, 1);
      return {...state, participants: [...state.participants, newTarget]}
    }
    case conferenceActions.LOCAL_VIDEO_STREAM_REMOVED: {
      const index = state.participants.findIndex((el: IParticipant) => el.id === payload.id);
      const newTarget = {...(state.participants as IParticipant[])[index], streamId: ''}
      state.participants.splice(index, 1);
      return {...state, participants: [...state.participants, newTarget]}
    }
    case conferenceActions.REMOVE_PARTICIPANT: {
      const filtred = state.participants.filter((item: IParticipant) => item.id !== payload.id);
      return { ...state, participants: filtred };
    }
    case conferenceActions.ENDPOINT_ADDED: {
      const targetEndpoint = state.participants.findIndex((el: IParticipant) => el.id === payload.id);
      if (targetEndpoint === -1) {
        return { ...state, participants: [ ...state.participants, payload ]};
      }
    }
    case conferenceActions.REMOTE_VIDEO_STREAM_ADDED: {
      const index = state.participants.findIndex((el: IParticipant) => el.id === payload.id);
      const newTarget =  {...(state.participants as IParticipant[])[index], streamId: payload.streamId}
      state.participants.splice(index, 1);
      return {...state, participants: [...state.participants, newTarget]}
    }
    case conferenceActions.REMOTE_VIDEO_STREAM_REMOVED: {
      const index = state.participants.findIndex((el: IParticipant) => el.id === payload.id);
      const newTarget =  {...(state.participants as IParticipant[])[index], streamId: ''}
      state.participants.splice(index, 1);
      return {...state, participants: [...state.participants, newTarget]}
    }
    case conferenceActions.ENDPOINT_REMOVED: {
      const filtred = state.participants.filter((item: IParticipant) => item.id !== payload.id);
      return { ...state, participants: filtred };
    }
    case conferenceActions.SET_ERROR: {
      return { ...state, error: payload }
    }
    case conferenceActions.REMOVE_ALL_PARTICIPANTS: {
      return { ...state, participants: [] }
    }
    case conferenceActions.ENDPOINT_VOICE_ACTIVITY_STARTED: {
      const index = state.participants.findIndex((el: IParticipant) => el.id === payload.id);
      const newTarget =  {...(state.participants as IParticipant[])[index], isActiveVoice: true}
      state.participants.splice(index, 1);
      return {...state, participants: [...state.participants, newTarget]}
    }
    case conferenceActions.ENDPOINT_VOICE_ACTIVITY_STOPPED: {
      const index = state.participants.findIndex((el: IParticipant) => el.id === payload.id);
      const newTarget =  {...(state.participants as IParticipant[])[index], isActiveVoice: false}
      state.participants.splice(index, 1);
      return {...state, participants: [...state.participants, newTarget]}
    }
    default:
      return state;
  }
};

export default conferenceReducer;