/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import { Alert } from 'react-native';

import { IAuthError } from "./types";

type convertedErrorType = {
  other: string;
  login: string;
  password: string;
};

export const useUtils = () => {
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

  const showAllert = (message: string) => {
    Alert.alert('Login error', message, [{ text: 'OK' }]);
  };

  return {
    convertError,
    showAllert,
  };
};