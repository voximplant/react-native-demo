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
    case conferenceActions.CHANGE_CALL_STATE:
      return { ...state, callState: payload, error: '' }
    case conferenceActions.CALL_FAILED:
      return { ...state, callState: payload.callState, error: payload.reason }
    case conferenceActions.UPDATE_PARTICIPANTS: {
      const target = state.participants.find((el: IParticipant) => el.id === payload.id);
      const newParticipant = Object.assign(target ?? {}, payload);
      if (target) {
        const filtred = state.participants.filter((item: IParticipant) => item.id !== payload.id);
        const mutated = [ ...filtred, newParticipant ];
        return { ...state, participants: mutated };
      } else {
        const mutated = [ ...state.participants, newParticipant ];
        return { ...state, participants: mutated };
      }
    }
    case conferenceActions.REMOVE_PARTICIPANT: {
      const filtred = state.participants.filter((item: IParticipant) => item.id !== payload.id);
      return { ...state, participants: filtred };
    }
    default:
      return state;
  }
};

export default conferenceReducer;