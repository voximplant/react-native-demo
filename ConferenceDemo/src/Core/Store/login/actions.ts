/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import {AppDispatch} from '..';
import {IReduxAction} from '../../../Utils/types';
import {convertedErrorType, useUtils} from '../../../Utils/useUtils';
import {AuthService} from '../../Services/AuthService';
import {resetState, toggleLoading} from '../global/actions';
import {loginActions} from './actionTypes';

// eslint-disable-next-line react-hooks/rules-of-hooks
const {convertError} = useUtils();

export const loginWithPass =
  (username: string, password: string) => async (dispatch: AppDispatch) => {
    dispatch(toggleLoading());
    try {
      const result = await AuthService().loginWithPassword(username, password);
      dispatch(loginSuccess(result));
    } catch (error) {
      const converted = convertError(error);
      dispatch(loginFailure(converted));
    }
    dispatch(toggleLoading());
  };

export const loginWithToken = () => async (dispatch: AppDispatch | any) => {
  dispatch(toggleLoading());
  try {
    const result = await AuthService().loginWithToken();
    dispatch(loginSuccess(result));
  } catch (error) {
    //@ts-ignore
    if (error?.code === 701) {
      dispatch(refreshToken());
    }
  }
  dispatch(toggleLoading());
};

export const refreshToken = () => async (dispatch: AppDispatch) => {
  dispatch(toggleLoading());
  try {
    const result = await AuthService().refreshToken();
    dispatch(loginSuccess(result));
  } catch (error) {
    const converted = convertError(error);
    dispatch(loginFailure(converted));
    await AuthService().logOut();
  }
  dispatch(toggleLoading());
};

export const logOutApp = () => async (dispatch: AppDispatch) => {
  dispatch(toggleLoading());
  try {
    await AuthService().logOut();
    dispatch(resetState());
  } catch (error) {
    console.error('logOutApp = method = error => ', error);
  }
  dispatch(toggleLoading());
};

export const loginSuccess = (payload: string): IReduxAction => ({
  type: loginActions.LOGIN_SUCCESS,
  payload,
});

export const loginFailure = (payload: convertedErrorType): IReduxAction => ({
  type: loginActions.LOGIN_FAILURE,
  payload,
});
