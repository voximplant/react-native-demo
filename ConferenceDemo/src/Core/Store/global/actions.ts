/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import {IReduxAction} from '../../../Utils/types';
import {globalActions} from './actionTypes';

export const toggleLoading = (): IReduxAction => ({
  type: globalActions.TOGGLE_LOADING,
});

export const resetState = (): IReduxAction => ({
  type: globalActions.RESET_STATE,
});

export const clearErrors = (): IReduxAction => ({
  type: globalActions.CLEAR_ERRORS,
});
