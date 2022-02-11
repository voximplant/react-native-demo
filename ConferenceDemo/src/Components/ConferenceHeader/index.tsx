/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import SwitchCameraIcon from '../../Assets/Icons/SwitchCamera.svg';
import SelectAudioIcon from '../../Assets/Icons/SelectAudio.svg';
import styles from './styles';

const ConferenceHeader = () => {
  return (
    <View style={styles.headerWrapper}>
      <TouchableOpacity onPress={() => {}} style={styles.buttonWrapper}>
        <SelectAudioIcon style={styles.buttonIcon} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{'Conf... 00:59'}</Text>
      <TouchableOpacity onPress={() => {}} style={styles.buttonWrapper}>
        <SwitchCameraIcon style={styles.buttonIcon} />
      </TouchableOpacity>
    </View>
)};

export default ConferenceHeader;
