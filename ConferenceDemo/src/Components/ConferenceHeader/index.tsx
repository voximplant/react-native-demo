/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import React, {useEffect, useRef, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';

import {HardwareService} from '../../Core/Services/HardwareService';
import {RootReducer} from '../../Core/Store';
import {useUtils} from '../../Utils/useUtils';

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
  const {formattedConferenceDuration} = useUtils();
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
