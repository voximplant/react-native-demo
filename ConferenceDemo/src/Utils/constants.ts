/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import { IAvailableDeivces } from "./types"

import PhoneIcon from '../Assets/Icons/mobileIcon.svg';
import PhoneIconWhite from '../Assets/Icons/mobileIconWhite.svg';
import PhoneIconActive from '../Assets/Icons/mobileIconActive.svg';
import SpeakerIcon from '../Assets/Icons/SpeakerIcon.svg';
import SpeakerIconWhite from '../Assets/Icons/SpeakerIconWhite.svg';
import SpeakerIconActive from '../Assets/Icons/SpeakerIconActive.svg';
import BluetoothIcon from '../Assets/Icons/bluetoothIcon.svg';
import BluetoothIconWhite from '../Assets/Icons/bluetoothIconWhite.svg';
import BluetoothIconActive from '../Assets/Icons/bluetoothIconActive.svg'
import HeadphonesIcon from '../Assets/Icons/headphonesIcon.svg';
import HeadphonesIconWhite from '../Assets/Icons/headphonesIconWhite.svg';
import HeadphonesIconActive from '../Assets/Icons/headphonesIconActive.svg';

export const COLORS = {
  PRIMARY: '#A432F5',
  WHITE: '#FFFFFF',
  RED: '#FF0000',
  PURPLE: '#662EFF',
  BLACK: '#000000',
  MINT: '#B4F8C8',
  GRAY: '#E3E4EB',
  DARK_GRAY: '#1F1C28',
  LIGHT_GRAY: '#F2F2F5',
}

export const STORAGE = {
  USER_NAME: 'VOX_USER_NAME',
  ACCESS_TOKEN: 'VOX_ACCESS_TOKEN',
  REFRESH_TOKEN: 'VOX_REFRESH_TOKEN',
}

export const availableDevices: IAvailableDeivces = {
  "Speaker": {
    key: "Speaker",
    text: "Speaker",
    Icon: SpeakerIcon,
    IconWhite: SpeakerIconWhite,
    IconActive: SpeakerIconActive,
  },
  "Earpiece": {
    key: "Earpiece",
    text: "Phone",
    Icon: PhoneIcon,
    IconWhite: PhoneIconWhite,
    IconActive: PhoneIconActive,
  },
  "Bluetooth": {
    key: "Bluetooth",
    text: "Blutooth Headphones",
    Icon: BluetoothIcon,
    IconWhite: BluetoothIconWhite,
    IconActive: BluetoothIconActive,
  },
  "WiredHeadset": {
    key: "WiredHeadset",
    text: "Headphones",
    Icon: HeadphonesIcon,
    IconWhite: HeadphonesIconWhite,
    IconActive: HeadphonesIconActive,
  },
}