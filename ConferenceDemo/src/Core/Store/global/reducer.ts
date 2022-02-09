/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import { IReduxAction } from "../../../Utils/types";
import { globalActions } from "./actionTypes";

const initialState = { loading: false };

export interface IGlobalReducer {
  loading: boolean,
}

const globalReducer = (state = initialState, action: IReduxAction): IGlobalReducer => {
  const { type, payload } = action;
  switch(type) {
    case globalActions.TOGGLE_LOADING: {
      return { ...state, loading: !state.loading}
    }
    default:
      return state;
  }
}

export default globalReducer;