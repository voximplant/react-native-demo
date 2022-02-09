/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import { IReduxAction } from "../../../Utils/types";

export interface IConferenceReducer {
  call: any | null,
  error: string,
}

const initialState = { call: null, error: ''};

const conferenceReducer = (state = initialState, action: IReduxAction): IConferenceReducer => {
  const { type, payload } = action;
  switch(type) {
    default:
      return state;
  }
}
export default conferenceReducer;