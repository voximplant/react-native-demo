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
      return { ...state, callState: payload, error: '' }
    }
    case conferenceActions.CALL_FAILED:
      return { ...state, callState: payload.callState, error: payload.reason }
    case conferenceActions.ADD_PARTICIPANT: {
      const target = state.participants.findIndex((el: IParticipant) => el.id === "_");
      if (target !== -1) {
        state.participants[target] = {...state.participants[target], id: payload.id}
        return state;
      } else {
        return { ...state, participants: [ ...state.participants, payload ]};
      }
    }
    case conferenceActions.LOCAL_VIDEO_STREAM_ADDED: {
      const targetCreated = state.participants.findIndex((el: IParticipant) => el.id === payload.id);
      if (targetCreated !== -1) {
        state.participants[targetCreated] = {...state.participants[targetCreated], streamId: payload.streamId}
        return state;
      } else {
        return { ...state, participants: [ ...state.participants, {...payload, id: "_"} ]};
      }
    }
    case conferenceActions.LOCAL_VIDEO_STREAM_REMOVED: {
      const targetSearched = state.participants.findIndex((el: IParticipant) => el.id === payload.id);
      state.participants[targetSearched] = {...state.participants[targetSearched], streamId: ''}
      return state;
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
      const target = state.participants.findIndex((el: IParticipant) => el.id === payload.id);
      state.participants[target] = {...state.participants[target], streamId: payload.streamId}
      return state;
    }
    case conferenceActions.REMOTE_VIDEO_STREAM_REMOVED: {
      const target = state.participants.findIndex((el: IParticipant) => el.id === payload.id);
      state.participants[target] = {...state.participants[target], streamId: ''}
      return state;
    }
    case conferenceActions.ENDPOINT_REMOVED: {
      const filtred = state.participants.filter((item: IParticipant) => item.id !== payload.id);
      return { ...state, participants: filtred };
    }
    default:
      return state;
  }
};

export default conferenceReducer;