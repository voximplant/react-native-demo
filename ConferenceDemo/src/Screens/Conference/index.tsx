/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import React from 'react';
import { StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ControlButton from '../../Components/ControlButton';
import ConferenceHeader from '../../Components/ConferenceHeader';

import { COLORS } from '../../Utils/constants';

import PhoneIcon from '../../Assets/Icons/Phone.svg';
import MicrophoneIcon from '../../Assets/Icons/Microphone.svg';
import VideocameraIcon from '../../Assets/Icons/Videocamera.svg';
import styles from './styles';

const ConferenceScreen = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle={'light-content'} backgroundColor={COLORS.BLACK} />
      <ConferenceHeader />
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
    </SafeAreaView>
  );
};

export default ConferenceScreen;
