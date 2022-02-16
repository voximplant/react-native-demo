/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import { IParticipant, IReduxAction } from "../../../Utils/types";
import { conferenceActions } from "./actionTypes";

export interface IConferenceReducer {
  participants: IParticipant[] ,
  callState: string,
  error: string,
}

const initialState = { participants: [], callState: 'Disconnected', error: ''};

const conferenceReducer = (state = initialState, action: IReduxAction): IConferenceReducer => {
  const { type, payload } = action;
  switch(type) {
    case conferenceActions.CHANGE_CALL_STATE:
      return { ...state, callState: payload }
    case conferenceActions.ADD_PARTICIPANT:
      return { ...state, participants: (state.participants as IParticipant[]).concat([payload])};
    case conferenceActions.REMOVE_PARTICIPANT:
      return { ...state, participants: state.participants.filter((item: IParticipant) => item.id !== payload.id)};
    // case conferenceActions.UPDATE_PARTICIPANT:
    //   return { ...state, participants: { ...state.participants, [payload.id]: payload} };
    default:
      return state;
  }
};

export default conferenceReducer;