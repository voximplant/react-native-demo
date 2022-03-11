/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import {useRef} from 'react';
//@ts-ignore
import {Voximplant} from 'react-native-voximplant';
import {useDispatch} from 'react-redux';

import {availableDevices} from '../../Utils/constants';

import {setListDevices, setSelectedDevice} from '../Store/conference/actions';

export const HardwareService = () => {
  const dispatch = useDispatch();

  const AudioDeviceManager =
    Voximplant.Hardware.AudioDeviceManager.getInstance();
  const CameraManager = Voximplant.Hardware.CameraManager.getInstance();

  const cameraType = Voximplant.Hardware.CameraType;

  const selectAudioDevice = async (device: string) => {
    await AudioDeviceManager.selectAudioDevice(device);
  };

  const getActiveDevice = async () => {
    const device = await AudioDeviceManager.getActiveDevice();
    dispatch(setSelectedDevice(availableDevices[device]));
  };

  const getAudioDevices = async () => {
    const list = await AudioDeviceManager.getAudioDevices();
    dispatch(setListDevices(list));
  };

  const subscribeDeviceChangedEvent = () => {
    AudioDeviceManager.on(
      Voximplant.Hardware.AudioDeviceEvents.DeviceChanged,
      (event: any) => {
        dispatch(setSelectedDevice(availableDevices[event.currentDevice]));
      },
    );
    AudioDeviceManager.on(
      Voximplant.Hardware.AudioDeviceEvents.DeviceListChanged,
      (event: any) => {
        dispatch(setListDevices(event.newDeviceList));
      },
    );
  };

  const unsubscribeFromDeviceChangedEvent = () => {
    AudioDeviceManager.off();
  };

  return {
    CameraManager,
    cameraType,
    selectAudioDevice,
    getAudioDevices,
    getActiveDevice,
    subscribeDeviceChangedEvent,
    unsubscribeFromDeviceChangedEvent,
  };
};
