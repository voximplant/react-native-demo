/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import {IAuthError, IReduxAction} from '../../../Utils/types';
import {globalActions} from '../global/actionTypes';
import {loginActions} from './actionTypes';

const initialState = {user: null, error: null};

export interface ILoginReducer {
  user: string | null;
  error: IAuthError | any;
}

const loginReducer = (
  state = initialState,
  action: IReduxAction,
): ILoginReducer => {
  const {type, payload} = action;
  switch (type) {
    case loginActions.LOGIN_SUCCESS: {
      return {...state, user: payload};
    }
    case loginActions.LOGIN_FAILURE: {
      return {...state, error: payload};
    }
    case globalActions.CLEAR_ERRORS: {
      return {...state, error: ''};
    }
    case globalActions.RESET_STATE: {
      return {...state, user: null, error: null};
    }
    default:
      return state;
  }
};

export default loginReducer;
