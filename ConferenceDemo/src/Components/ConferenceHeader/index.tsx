/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import React, {useEffect, useRef, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';

import {HardwareService} from '../../Core/Services/HardwareService';
import {RootReducer} from '../../Core/Store';

import SwitchCameraIcon from '../../Assets/Icons/SwitchCamera.svg';
import SelectAudioIcon from '../../Assets/Icons/SelectAudio.svg';
import styles from './styles';

interface IProps {
  toggleModalAudioDevices: () => void;
  getConferenceDuration: () => any;
}

const ConferenceHeader = ({
  toggleModalAudioDevices,
  getConferenceDuration,
}: IProps) => {
  const {CameraManager, cameraType} = HardwareService();
  const [cameraState, setCameraState] = useState(cameraType.FRONT);
  const [time, setTime] = useState<number | null>(null);
  let intervalRef = useRef<any>(null);

  const SelectedDeviceIcon = useSelector(
    (state: RootReducer) =>
      state.conferenceReducer.selectedAudioDevice?.IconWhite,
  );

  const toggleCameraMode = () => {
    if (cameraState === cameraType.FRONT) {
      CameraManager.switchCamera(cameraType.BACK);
      setCameraState(cameraType.BACK);
    } else {
      CameraManager.switchCamera(cameraType.FRONT);
      setCameraState(cameraType.FRONT);
    }
  };

  const formattedConferenceDuration = (seconds: number | null) => {
    if (seconds === null) {
      return;
    }
    if (seconds < 60) {
      return `00:${seconds < 10 ? `0${seconds}` : seconds}`;
    }
    if (seconds >= 60 && seconds < 3600) {
      let min = (seconds / 60).toString().split('.')[0];
      let sec = seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60;
      return `${+min < 10 ? `0${min}` : min}:${sec}`;
    }
    if (seconds >= 3600) {
      let hours = (seconds / 3600).toString().split('.')[0];
      let min = ((seconds - +hours * 3600) / 60).toString().split('.')[0];
      let sec =
        seconds - (+hours * 3600 + +min * 60) < 10
          ? `0${seconds - (+hours * 3600 + +min * 60)}`
          : seconds - (+hours * 3600 + +min * 60);
      return `${+hours < 10 ? `0${hours}` : hours}:${
        +min < 10 ? `0${min}` : min
      }:${sec}`;
    }
  };

  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      const duration = await getConferenceDuration();
      if (duration === time || duration === 0) {
        return;
      }
      setTime(duration);
    }, 300);

    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, []);

  return (
    <View style={styles.headerWrapper}>
      <TouchableOpacity
        onPress={toggleModalAudioDevices}
        style={styles.buttonWrapper}>
        {SelectedDeviceIcon ? (
          <SelectedDeviceIcon style={styles.buttonIcon} />
        ) : (
          <SelectAudioIcon style={styles.buttonIcon} />
        )}
      </TouchableOpacity>
      <Text style={styles.headerTitle}>
        {formattedConferenceDuration(time)}
      </Text>
      <TouchableOpacity onPress={toggleCameraMode} style={styles.buttonWrapper}>
        <SwitchCameraIcon style={styles.buttonIcon} />
      </TouchableOpacity>
    </View>
  );
};

export default ConferenceHeader;
