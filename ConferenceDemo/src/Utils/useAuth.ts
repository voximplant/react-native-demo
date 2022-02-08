//@ts-ignore
import {Voximplant} from 'react-native-voximplant';

import { STORAGE } from './constants';
import { IAuthResult } from './types';
import { useUtils } from "./useUtils";

export const useAuth = () => {
  const voximplant = Voximplant.getInstance();
  const { setStorageItems, setStorageItem, clearStorageItems, getStorageItem } = useUtils();

  const connectToVox = async () => {
    await voximplant.connect();
  };

  const loginWithPassword = async (username: string, password: string): Promise<string> => {
    try {
      let clientState = await voximplant.getClientState();
      if (clientState === Voximplant.ClientState.DISCONNECTED) {
        await connectToVox();
      }
      const result = await voximplant.login(
        `${username.toLowerCase()}.voximplant.com`,
        password,
      );
      setStorageItem(STORAGE.USERNAME, username);
      setStorageItems(result);
      return result.displayName;
    } catch (e) {
      throw e;
    }
  }

  const loginWithToken = async (): Promise<string | undefined> => {
    try {
      let username = await getStorageItem(STORAGE.USERNAME);
      let token = await getStorageItem(STORAGE.A_TOKEN);
      if (username && token) {
        let clientState = await voximplant.getClientState();
        if (clientState === Voximplant.ClientState.DISCONNECTED) {
          await connectToVox();
        }
        const result = await voximplant.loginWithToken(
          `${username.toLowerCase()}.voximplant.com`,
          token,
        );
        setStorageItems(result);
        return result.displayName;
      }
    } catch (e) {
      throw e;
    }
  };

  const refreshToken = async (): Promise<IAuthResult> => {
    try {
      let username = await getStorageItem(STORAGE.USERNAME);
      let rToken = await getStorageItem(STORAGE.R_TOKEN);
      const result = await voximplant.tokenRefresh(
        `${username?.toLowerCase()}.voximplant.com`,
        rToken,
      );
      return result;
    } catch (e) {
      throw e;
    }
  };

  const logOut = async (): Promise<void> => {
    try {
      await clearStorageItems();
      await voximplant.disconnect();
    } catch (e) {
      console.error('LOG_OUT_ERROR=====>', e);
    }
  };

  return {
    loginWithPassword,
    loginWithToken,
    refreshToken,
    logOut,
  };
};