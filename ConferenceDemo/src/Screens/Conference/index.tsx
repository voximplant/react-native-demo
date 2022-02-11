/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import React from 'react';
import { View } from 'react-native';
import ControlButton from '../../Components/ControlButton';

import PhoneIcon from '../../Assets/Icons/Phone.svg';
import MicrophoneIcon from '../../Assets/Icons/Microphone.svg';
import VideocameraIcon from '../../Assets/Icons/Videocamera.svg';
import styles from './styles';

const ConferenceScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
      </View>
      <View style={styles.bottomControlBar}>
        <View style={styles.buttonsWrapper}>
          <ControlButton
            Icon={VideocameraIcon}
            onPress={() => {}}
            styleFromProps={{
              wrapper: styles.controlButtonWrapper,
            }}
          />
          <ControlButton
            Icon={MicrophoneIcon}
            onPress={() => {}}
            styleFromProps={{
              wrapper: styles.controlButtonWrapper,
            }}
          />
          <ControlButton
            Icon={PhoneIcon}
            onPress={() => {}}
            styleFromProps={{
              wrapper: styles.controlButtonWrapperHangup,
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default ConferenceScreen;
