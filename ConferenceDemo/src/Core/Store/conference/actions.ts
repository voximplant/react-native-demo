/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import { ICallFailed, IParticipant } from "../../../Utils/types";
import { conferenceActions } from "./actionTypes";

export const toggleIsMuted = () => ({
  type: conferenceActions.TOGGLE_IS_MUTED,
});

export const toggleIsLocalVideo = () => ({
  type: conferenceActions.TOGGLE_LOCAL_VIDEO,
});

export const changeCallState = (payload: string) => ({
  type: conferenceActions.CHANGE_CALL_STATE,
  payload,
});

export const callFailed = (payload: ICallFailed) => ({
  type: conferenceActions.CALL_FAILED,
  payload,
});

export const updateParticipants = (payload: IParticipant) => ({
  type: conferenceActions.UPDATE_PARTICIPANTS,
  payload,
});

export const removeParticipant = (payload: IParticipant) => ({
  type: conferenceActions.REMOVE_PARTICIPANT,
  payload,
});