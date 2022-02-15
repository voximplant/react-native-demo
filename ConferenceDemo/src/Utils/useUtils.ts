/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import { Alert, PermissionsAndroid, Platform } from 'react-native';

import { IAuthError } from "./types";

type convertedErrorType = {
  other: string;
  login: string;
  password: string;
};

export const useUtils = () => {
  const isIOS = Platform.OS === 'ios';

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
        message: "Conference needs access to microphone",
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
        message: "Conference needs access to camera",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    return (granted === PermissionsAndroid.RESULTS.GRANTED)
  };

  const showAllert = (message: string) => {
    Alert.alert('Login error', message, [{ text: 'OK' }]);
  };

  return {
    isIOS,
    convertError,
    showAllert,
    checkAndroidMicrophonePermission,
    checkAndroidCameraPermission,
  };
};