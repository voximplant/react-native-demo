/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

//@ts-ignore
import {Voximplant} from 'react-native-voximplant';

import { StorageService } from './StorageService';

import { STORAGE } from '../../Utils/constants';

export const AuthService = () => {
  const client = Voximplant.getInstance();
  const  {setStorageItem, getStorageItem, setStorageItems, clearStorageItems } = StorageService();

  const connectToVox = async () => {
    await client.connect();
  };

  const loginWithPassword = async (username: string, password: string): Promise<string> => {
    let clientState = await client.getClientState();
    if (clientState === Voximplant.ClientState.DISCONNECTED) {
      await connectToVox();
    }
    const result = await client.login(
      `${username.toLowerCase()}.voximplant.com`,
      password,
    );
    await setStorageItem(STORAGE.USER_NAME, username);
    await setStorageItems(result);
    return result.displayName;
  }

  const loginWithToken = async (): Promise<string> => {
    let username = await getStorageItem(STORAGE.USER_NAME);
    let token = await getStorageItem(STORAGE.ACCESS_TOKEN);
    let clientState = await client.getClientState();
    if (clientState === Voximplant.ClientState.DISCONNECTED) {
      await connectToVox();
    }
    const result = await client.loginWithToken(
      `${username?.toLowerCase()}.voximplant.com`,
      token,
    );
    await setStorageItems(result);
    return result.displayName;
  };

  const refreshToken = async (): Promise<string> => {
    let username = await getStorageItem(STORAGE.USER_NAME);
    let rToken = await getStorageItem(STORAGE.REFRESH_TOKEN);
    const result = await client.tokenRefresh(
      `${username?.toLowerCase()}.voximplant.com`,
      rToken,
    );
    await setStorageItems(result);
    return result.displayName;
  };

  const logOut = async (): Promise<void> => {
    await clearStorageItems();
    await client.disconnect();
  };

  return {
    loginWithPassword,
    loginWithToken,
    logOut,
    refreshToken,
  }
};