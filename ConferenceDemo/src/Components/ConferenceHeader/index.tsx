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
  const {CameraManager, cameraTypeFront, cameraTypeBack} = ConferenceService();
  const [cameraState, setCameraState] = useState(cameraTypeFront);
  
  const toggleCameraMode = () => {
    if (cameraState === cameraTypeFront) {
      CameraManager.switchCamera(cameraTypeBack);
      setCameraState(cameraTypeBack);
    } else {
      CameraManager.switchCamera(cameraTypeFront);
      setCameraState(cameraTypeFront);
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
