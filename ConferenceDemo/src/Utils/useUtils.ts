import { Alert } from 'react-native';
//@ts-ignore
import {Voximplant} from 'react-native-voximplant';
import AsyncStorage from "@react-native-async-storage/async-storage";

import { IAuthError, IAuthResult, TextInputRefType } from "./types";
import { STORAGE } from "./constants";

export const useUtils = () => {
  const getStorageItem = async (key: string) => {
    const value = await AsyncStorage.getItem(key);
    return value;
  };

  const setStorageItem = async (key: string, value: string) => {
    await AsyncStorage.setItem(key, value);
  };

  const removeStorageItem = async (key: string) => {
    await AsyncStorage.removeItem(key);
  };

  const setStorageItems = async (authResult: IAuthResult) => {
    if (authResult?.tokens) {
      await setStorageItem(STORAGE.A_TOKEN, authResult.tokens.accessToken);
      await setStorageItem(STORAGE.A_TOKEN_EXP, authResult.tokens.accessExpire.toString());
      await setStorageItem(STORAGE.R_TOKEN, authResult.tokens.refreshToken);
      await setStorageItem(STORAGE.R_TOKEN_EXP, authResult.tokens.refreshExpire.toString());
    }
  };

  const clearStorageItems = async () => {
    await removeStorageItem(STORAGE.USERNAME);
    await removeStorageItem(STORAGE.A_TOKEN);
    await removeStorageItem(STORAGE.A_TOKEN_EXP);
    await removeStorageItem(STORAGE.R_TOKEN);
    await removeStorageItem(STORAGE.R_TOKEN_EXP);
  };

  const convertError = (error: IAuthError | any, loginRef: TextInputRefType, passRef: TextInputRefType): string => {
    let message = '';
    switch (error.name) {
      case Voximplant.ClientEvents.ConnectionFailed:
        message = 'Connection error, check your internet connection';
        break;
      case Voximplant.ClientEvents.AuthResult:
        convertErrorCodeMessage(error.code, loginRef, passRef);
        break;
      default:
        message = 'Unknown error. Try again';
    }
    return message;
  };
  
  const convertErrorCodeMessage = (code: number, loginRef: TextInputRefType, passRef: TextInputRefType) => {
    switch (code) {
      case 401:
        passRef.current?.setNativeProps({borderColor: 'red'});
        return;
      case 404:
        loginRef.current?.setNativeProps({borderColor: 'red'});
        return;
      case 491:
        return 'Invalid state';
      default:
        return 'Try again later';
    }
  };

  const showAllert = (message: string) => {
    Alert.alert('Login error', message, [{ text: 'OK' }]);
  };

  return {
    setStorageItems,
    getStorageItem,
    setStorageItem,
    clearStorageItems,
    convertError,
    showAllert,
  };
};