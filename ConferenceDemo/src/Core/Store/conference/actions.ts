/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import { IParticipant } from "../../../Utils/types";
import { conferenceActions } from "./actionTypes";

export const changeCallState = (payload: string) => ({
  type: conferenceActions.CHANGE_CALL_STATE,
  payload,
});

export const addParticipant = (payload: IParticipant) => ({
  type: conferenceActions.ADD_PARTICIPANT,
  payload,
});

export const updateParticipant = (payload: IParticipant) => ({
  type: conferenceActions.UPDATE_PARTICIPANT,
  payload,
});

export const removeParticipant = (payload: IParticipant) => ({
  type: conferenceActions.REMOVE_PARTICIPANT,
  payload,
});