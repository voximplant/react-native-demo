/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';

import {HardwareService} from '../../Core/Services/HardwareService';
import {RootReducer} from '../../Core/Store';

import SwitchCameraIcon from '../../Assets/Icons/SwitchCamera.svg';
import SelectAudioIcon from '../../Assets/Icons/SelectAudio.svg';
import styles from './styles';

interface IProps {
  toggleModalAudioDevices: () => void;
}

const ConferenceHeader = ({toggleModalAudioDevices}: IProps) => {
  const {CameraManager, cameraType} = HardwareService();
  const [cameraState, setCameraState] = useState(cameraType.FRONT);
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
      <Text style={styles.headerTitle}>{''}</Text>
      <TouchableOpacity onPress={toggleCameraMode} style={styles.buttonWrapper}>
        <SwitchCameraIcon style={styles.buttonIcon} />
      </TouchableOpacity>
    </View>
  );
};

export default ConferenceHeader;
