/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

//@ts-ignore
import {Voximplant} from 'react-native-voximplant';

import {StorageService} from './StorageService';

import {STORAGE} from '../../Utils/constants';

export const AuthService = () => {
  const client = Voximplant.getInstance();
  const {setStorageItem, getStorageItem, setStorageItems, clearStorageItems} =
    StorageService();

  const connectToVox = async () => {
    await client.connect();
  };

  const getClientState = async () => await client.getClientState();

  const loginWithPassword = async (
    username: string,
    password: string,
  ): Promise<string> => {
    const clientState = await getClientState();
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
  };

  const loginWithToken = async (): Promise<string | undefined> => {
    const username = await getStorageItem(STORAGE.USER_NAME);
    const token = await getStorageItem(STORAGE.ACCESS_TOKEN);
    if (!username || !token) {
      return;
    }
    // Connection to the Voximplant Cloud is stayed alive on reloading of the app's
    // JavaScript code. Calling "disconnect" API here makes the SDK and app states
    // synchronized.
    await client.disconnect();
    await connectToVox();
    let result = await client.loginWithToken(
      `${username?.toLowerCase()}.voximplant.com`,
      token,
    );
    await setStorageItems(result);
    return result?.displayName;
  };
  const refreshToken = async (): Promise<string> => {
    const username = await getStorageItem(STORAGE.USER_NAME);
    const rToken = await getStorageItem(STORAGE.REFRESH_TOKEN);
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
    getClientState,
  };
};
