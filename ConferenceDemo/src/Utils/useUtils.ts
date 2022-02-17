/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import { Alert, PermissionsAndroid, Platform } from 'react-native';

import { IAuthError, IParticipant } from "./types";

type convertedErrorType = {
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
        title: "Microphone Permission",
        message: "To join a conference call, please allow access to the microphone",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    return (granted === PermissionsAndroid.RESULTS.GRANTED)
  };

  const checkAndroidCameraPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: "Camera Permission",
        message: "To enable video in a conference call, please allow access to the camera",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    return (granted === PermissionsAndroid.RESULTS.GRANTED)
  };

  const showAllert = (message: string) => {
    Alert.alert('Login error', message, [{ text: 'OK' }]);
  };

  const convertParticitantModel = ({id, name, streamId }: IParticipant) => {
    return {
      id,
      name: name ?? '',
      streamId: streamId ?? '',
    }
  };

  const dynamicComputeStyles = (
    containerHeight: number,
    containerWidth: number,
    participantsCount: number,
    index: number,
  ) => {
    const forOne = {height: containerHeight, width: containerWidth};
    const forTwo = {height: containerHeight / 2, width: containerWidth};
    const forThreePartOne = {height: containerHeight / 2, width: containerWidth / 2};
    const forFour = {height: containerHeight / 2, width: containerWidth / 2};
    const forFivePartOne = {height: containerHeight / 2, width: containerWidth / 3};
  
    if (participantsCount === 1) {
      return forOne;
    }
    if (participantsCount === 2) {
      return forTwo;
    }
    if (participantsCount === 3) {
      if (index === 0 || index === 1) {
        return forThreePartOne;
      } else {
        return forTwo;
      }
    }
    if (participantsCount === 4) {
      return forFour;
    }
    if (participantsCount === 5) {
      if (index <= 2) {
        return forFivePartOne;
      } else {
        return forFour;
      }
    }
    if (participantsCount >= 6) {
      return forFivePartOne;
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
  };
};