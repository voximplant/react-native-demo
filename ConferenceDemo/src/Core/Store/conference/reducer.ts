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
      return { ...state, callState: payload }
    //   const target = state.participants.find((el: IParticipant) => el.id === payload.id);
    //   const newParticipant = Object.assign(target ?? {}, payload);
      // return { ...state, participants: (state.participants as IParticipant[]).concat([newParticipant])};
    case conferenceActions.UPDATE_PARTICIPANTS: {
      const index = state.participants.findIndex((el: IParticipant) => el.id === payload.id);
      if (index !== -1) {
        (state.participants as IParticipant[])[index] = Object.assign(state.participants[index], payload)
        return { ...state };
      } else {
        (state.participants as IParticipant[]).push(Object.assign({}, payload))
        return { ...state };
      }
      // const updParticipant = Object.assign(targetUpd ?? {}, payload);
      // const position = state.participants.map((el: IParticipant) => el.id).indexOf(payload.id);
      // return { ...state, participants: targetUpd ? (state.participants as IParticipant[])[index] = updParticipant : [ ...state.participants, updParticipant ] };
      // if (position !== -1) {
      //   return {...state, participants: (state.participants as IParticipant[])[position] = updParticipant};
      // } else {
      //   (state.participants as IParticipant[]).push(updParticipant)
      //   return {...state};
      // }
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