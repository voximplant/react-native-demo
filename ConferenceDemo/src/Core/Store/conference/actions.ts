/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import {AvailableDevice, IParticipant} from '../../../Utils/types';
import {conferenceActions} from './actionTypes';

export const toggleMute = () => ({
  type: conferenceActions.TOGGLE_MUTE,
});

export const toggleSendVideo = () => ({
  type: conferenceActions.TOGGLE_SEND_VIDEO,
});

export const changeCallState = (payload: string) => ({
  type: conferenceActions.CHANGE_CALL_STATE,
  payload,
});

export const setError = (payload: any) => ({
  type: conferenceActions.SET_ERROR,
  payload,
});

export const videoStreamAdded = (payload: any) => ({
  type: conferenceActions.VIDEO_STREAM_ADDED,
  payload,
});

export const videoStreamRemoved = (payload: any) => ({
  type: conferenceActions.VIDEO_STREAM_REMOVED,
  payload,
});

export const endpointAdded = (payload: any) => ({
  type: conferenceActions.ENDPOINT_ADDED,
  payload,
});

export const endpointRemoved = (payload: any) => ({
  type: conferenceActions.ENDPOINT_REMOVED,
  payload,
});

export const removeAllParticipants = () => ({
  type: conferenceActions.REMOVE_ALL_PARTICIPANTS,
});

export const endpointVoiceActivityStarted = (payload: IParticipant) => ({
  type: conferenceActions.ENDPOINT_VOICE_ACTIVITY_STARTED,
  payload,
});

export const endpointVoiceActivityStopped = (payload: IParticipant) => ({
  type: conferenceActions.ENDPOINT_VOICE_ACTIVITY_STOPPED,
  payload,
});

export const endpointMuted = (payload: IParticipant) => ({
  type: conferenceActions.ENDPOINT_MUTED,
  payload,
});

export const setSelectedDevice = (payload: AvailableDevice) => ({
  type: conferenceActions.SET_SELECTED_AUDIO_DEVICE,
  payload,
});

export const setListDevices = (payload: Array<string>) => ({
  type: conferenceActions.SET_LIST_AUDIO_DEVICES,
  payload,
});
