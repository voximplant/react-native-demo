/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import { conferenceActions } from "./actionTypes";

export const changeCallState = (payload: any) => ({
  type: conferenceActions.CHANGE_CALL_STATE,
  payload,
});

export const callFailed = (payload: string) => ({
  type: conferenceActions.CHANGE_CALL_STATE,
  payload,
});