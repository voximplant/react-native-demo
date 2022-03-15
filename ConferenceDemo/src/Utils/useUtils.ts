/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import {Alert, PermissionsAndroid, Platform} from 'react-native';

import {IAuthError, IParticipant} from './types';

export type convertedErrorType = {
  other: string;
  login: string;
  password: string;
};

export const useUtils = () => {
  const isIOS = Platform.OS === 'ios';
  const isAndroid = Platform.OS === 'android';

  const convertError = (error: IAuthError | any): convertedErrorType => {
    let convertedError = {
      other: '',
      login: '',
      password: '',
    };

    switch (error.code) {
      case 401:
        convertedError.password = 'Incorrect password';
        break;
      case 402:
        convertedError.other = 'MAU access denied';
        break;
      case 403:
        convertedError.other = 'Account frozen';
        break;
      case 404:
        convertedError.login = 'Incorrect login';
        break;
      default:
        convertedError.other = 'Try again later';
        break;
    }
    return convertedError;
  };

  const checkAndroidMicrophonePermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Microphone Permission',
        message:
          'To join a conference call, please allow access to the microphone',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const checkAndroidCameraPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message:
          'To enable video in a conference call, please allow access to the camera',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const showAllert = (message: string) => {
    Alert.alert('Login error', message, [{text: 'OK'}]);
  };

  const convertParticitantModel = ({
    id,
    name,
    streamId,
    isActiveVoice,
    isMuted,
    hasEnabledStream,
  }: IParticipant) => {
    return {
      id,
      name: name ?? null,
      streamId: streamId ?? '',
      isActiveVoice: isActiveVoice ?? false,
      isMuted: isMuted ?? false,
      hasEnabledStream: hasEnabledStream ?? true,
    };
  };

  const dynamicComputeStyles = (
    containerWidth: number,
    containerHeight: number,
    participantsCount: number,
    index: number,
  ) => {
    const marginParticipants = 4;
    const forOneInRow = containerWidth - marginParticipants;
    const forTwoInRow = containerWidth / 2 - marginParticipants;

    const forOneInColumn = containerHeight - marginParticipants;
    const forTwoInColumn = containerHeight / 2 - marginParticipants;
    const forThreeInColumn = containerHeight / 3 - marginParticipants;

    switch (participantsCount) {
      case 1: {
        return {width: forOneInRow, height: forOneInColumn};
      }
      case 2: {
        return {width: forOneInRow, height: forTwoInColumn};
      }
      case 3: {
        if (index === 0 || index === 1) {
          return {width: forTwoInRow, height: forTwoInColumn};
        } else {
          return {width: forOneInRow, height: forTwoInColumn};
        }
      }
      case 4: {
        return {width: forTwoInRow, height: forTwoInColumn};
      }
      case 5: {
        if (index <= 2) {
          return {width: forTwoInRow, height: forThreeInColumn};
        } else {
          return {width: forTwoInRow, height: forThreeInColumn};
        }
      }
      default: {
        return {width: forTwoInRow, height: forThreeInColumn};
      }
    }
  };

  const formattedConferenceDuration = (seconds: number | null) => {
    if (seconds === null) {
      return;
    }
    if (seconds < 60) {
      return `00:${seconds < 10 ? `0${seconds}` : seconds}`;
    }
    if (seconds >= 60 && seconds < 3600) {
      let min = (seconds / 60).toString().split('.')[0];
      let sec = seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60;
      return `${+min < 10 ? `0${min}` : min}:${sec}`;
    }
    if (seconds >= 3600) {
      let hours = (seconds / 3600).toString().split('.')[0];
      let min = ((seconds - +hours * 3600) / 60).toString().split('.')[0];
      let sec =
        seconds - (+hours * 3600 + +min * 60) < 10
          ? `0${seconds - (+hours * 3600 + +min * 60)}`
          : seconds - (+hours * 3600 + +min * 60);
      return `${+hours < 10 ? `0${hours}` : hours}:${
        +min < 10 ? `0${min}` : min
      }:${sec}`;
    }
  };

  return {
    isIOS,
    isAndroid,
    convertError,
    showAllert,
    checkAndroidMicrophonePermission,
    checkAndroidCameraPermission,
    convertParticitantModel,
    dynamicComputeStyles,
    formattedConferenceDuration,
  };
};
