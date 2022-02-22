/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import { ConferenceService } from '../../Core/Services/ConferenceService';

import SwitchCameraIcon from '../../Assets/Icons/SwitchCamera.svg';
import SelectAudioIcon from '../../Assets/Icons/SelectAudio.svg';
import styles from './styles';


interface IProps {
  toggleModalAudioDevices: () => void;
};

const ConferenceHeader = ({toggleModalAudioDevices}: IProps) => {
  const {CameraManager, cameraType} = ConferenceService();
  const [cameraState, setCameraState] = useState(cameraType.FRONT);
  
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
      <TouchableOpacity onPress={toggleModalAudioDevices} style={styles.buttonWrapper}>
        <SelectAudioIcon style={styles.buttonIcon} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{'Conf... 00:59'}</Text>
      <TouchableOpacity onPress={toggleCameraMode} style={styles.buttonWrapper}>
        <SwitchCameraIcon style={styles.buttonIcon} />
      </TouchableOpacity>
    </View>
)};

export default ConferenceHeader;
