/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import { FC, RefObject } from 'react';
import { TextInput } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SvgProps } from 'react-native-svg';

export type RootStackParamList = {
  Login: undefined;
  Main: MainParamList | undefined;
  Conference: ConferenceParamList;
};

export type MainParamList = {
  displayName: string;
}

export type ConferenceParamList = {
  conference: string;
}

export type ScreenNavigationProp<T extends keyof RootStackParamList> = 
NativeStackNavigationProp<RootStackParamList, T>;

export type ScreenRouteProp<T extends keyof RootStackParamList> = 
RouteProp<RootStackParamList, T>;

export type IScreenProps<T extends keyof RootStackParamList> = {
  route: ScreenRouteProp<T>;
  navigation: ScreenNavigationProp<T>;
};

export interface IAuthResult {
  displayName: string;
  name: string;
  result: number;
  tokens: {
    accessExpire: number;
    accessToken: string;
    refreshExpire: number;
    refreshToken: string;
  }
}

export interface IAuthError {
  code: number;
  name: string;
  result: number;
}

export type TextInputRefType = RefObject<TextInput>;

export interface IReduxAction {
  type: string;
  payload?: any;
}

export type IParticipant = {
  id: string;
  name?: string | null;
  streamId?: string;
  isActiveVoice?: boolean;
  isMuted?: boolean;
}

export interface IAvailableDeivces {
  [key: string]: AvailableDevice;
};

export type AvailableDevice = {
  key: string;
  text: string;
  Icon: FC<SvgProps>;
  IconWhite: FC<SvgProps>;
  IconActive: FC<SvgProps>;
};
