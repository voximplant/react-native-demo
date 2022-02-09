/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

import { IAuthResult } from "../../Utils/types";
import { STORAGE } from "../../Utils/constants";

export const StorageService = () => {
  const getStorageItem = async (key: string) => {
    return await AsyncStorage.getItem(key);
  };

  const setStorageItem = async (key: string, value: string) => {
    await AsyncStorage.setItem(key, value);
  };

  const removeStorageItem = async (key: string) => {
    await AsyncStorage.removeItem(key);
  };

  const setStorageItems = async (authResult: IAuthResult) => {
    if (authResult?.tokens) {
      await setStorageItem(STORAGE.ACCESS_TOKEN, authResult.tokens.accessToken);
      await setStorageItem(STORAGE.REFRESH_TOKEN, authResult.tokens.refreshToken);
    }
  };

  const clearStorageItems = async () => {
    await removeStorageItem(STORAGE.USER_NAME);
    await removeStorageItem(STORAGE.ACCESS_TOKEN);
    await removeStorageItem(STORAGE.REFRESH_TOKEN);
  };

  return {
    setStorageItems,
    getStorageItem,
    setStorageItem,
    clearStorageItems,
  };
};