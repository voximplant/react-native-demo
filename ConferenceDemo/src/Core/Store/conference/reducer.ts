/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import { IReduxAction } from "../../../Utils/types";
import { conferenceActions } from "./actionTypes";

export interface IConferenceReducer {
  call: any | null,
  callState: string,
  error: string,
}

const initialState = { call: null, callState: 'Disconnected', error: ''};

const conferenceReducer = (state = initialState, action: IReduxAction): IConferenceReducer => {
  const { type, payload } = action;
  switch(type) {
    case conferenceActions.CHANGE_CALL_STATE:
      return { ...state, callState: payload }
    case conferenceActions.CALL_FAILED:
      return { ...state, error: payload };
    default:
      return state;
  }
};

export default conferenceReducer;