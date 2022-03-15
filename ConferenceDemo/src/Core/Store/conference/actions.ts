/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import {
  AvailableDevice,
  IParticipant,
  IReduxAction,
} from '../../../Utils/types';
import {conferenceActions} from './actionTypes';

export const toggleMute = (): IReduxAction => ({
  type: conferenceActions.TOGGLE_MUTE,
});

export const toggleSendVideo = (): IReduxAction => ({
  type: conferenceActions.TOGGLE_SEND_VIDEO,
});

export const changeCallState = (payload: string): IReduxAction => ({
  type: conferenceActions.CHANGE_CALL_STATE,
  payload,
});

export const setError = (payload: string): IReduxAction => ({
  type: conferenceActions.SET_ERROR,
  payload,
});

export const videoStreamAdded = (payload: IParticipant): IReduxAction => ({
  type: conferenceActions.VIDEO_STREAM_ADDED,
  payload,
});

export const videoStreamRemoved = (payload: IParticipant): IReduxAction => ({
  type: conferenceActions.VIDEO_STREAM_REMOVED,
  payload,
});

export const endpointAdded = (payload: IParticipant): IReduxAction => ({
  type: conferenceActions.ENDPOINT_ADDED,
  payload,
});

export const endpointRemoved = (payload: IParticipant): IReduxAction => ({
  type: conferenceActions.ENDPOINT_REMOVED,
  payload,
});

export const resetCallState = (): IReduxAction => ({
  type: conferenceActions.RESET_CALL_STATE,
});

export const endpointVoiceActivityStarted = (
  payload: IParticipant,
): IReduxAction => ({
  type: conferenceActions.ENDPOINT_VOICE_ACTIVITY_STARTED,
  payload,
});

export const endpointVoiceActivityStopped = (
  payload: IParticipant,
): IReduxAction => ({
  type: conferenceActions.ENDPOINT_VOICE_ACTIVITY_STOPPED,
  payload,
});

export const endpointMuted = (payload: IParticipant): IReduxAction => ({
  type: conferenceActions.ENDPOINT_MUTED,
  payload,
});

export const setSelectedDevice = (payload: AvailableDevice): IReduxAction => ({
  type: conferenceActions.SET_SELECTED_AUDIO_DEVICE,
  payload,
});

export const setListDevices = (payload: Array<string>): IReduxAction => ({
  type: conferenceActions.SET_LIST_AUDIO_DEVICES,
  payload,
});

export const manageParticipantStream = (
  payload: IParticipant,
): IReduxAction => ({
  type: conferenceActions.MANAGE_PARTICIPANT_STREAM,
  payload,
});
