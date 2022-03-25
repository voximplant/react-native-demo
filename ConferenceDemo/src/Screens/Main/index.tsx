/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import React, {useEffect, useState} from 'react';
import {View, StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';

import CustomInput from '../../Components/CustomInput';
import CustomButton from '../../Components/CustomButton';
import MainHeader from '../../Components/MainHeader';
import AvoidKeyboardView from '../../Components/AvoidKeyboardView';

import {IScreenProps} from '../../Utils/types';
import {COLORS} from '../../Utils/constants';
import {useUtils} from '../../Utils/useUtils';
import {
  changeCallState,
  toggleSendVideo,
} from '../../Core/Store/conference/actions';

import styles from './styles';

const MainScreen = ({navigation}: IScreenProps<'Main'>) => {
  const dispatch = useDispatch();
  const {
    isIOS,
    isAndroid,
    checkAndroidMicrophonePermission,
    checkAndroidCameraPermission,
  } = useUtils();

  const [conference, setConference] = useState('');
  const [validationText, setValidationText] = useState('');

  useEffect(() => {
    setValidationText('');
  }, [conference]);

  const startConference = async (withVideo?: boolean) => {
    if (!conference) {
      setValidationText('Name cannot be empty');
      return;
    }
    if (withVideo) {
      dispatch(toggleSendVideo());
    }
    let resultAudio;
    let resultVideo;
    if (isAndroid) {
      try {
        resultAudio = await checkAndroidMicrophonePermission();
        if (withVideo) {
          resultVideo = await checkAndroidCameraPermission();
          !resultVideo && dispatch(toggleSendVideo());
        }
      } catch (error) {
        console.warn('Something was wrong with android permissions...');
      }
    }
    if (resultAudio || isIOS) {
      dispatch(changeCallState('Connecting...'));
      navigation.navigate('Conference', {conference});
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AvoidKeyboardView stylesFromProps={styles.container}>
        <StatusBar
          barStyle={'light-content'}
          backgroundColor={COLORS.PRIMARY}
        />
        <MainHeader />
        <View style={styles.contentWrapper}>
          <CustomInput
            title={'Conference name'}
            value={conference}
            placeholder={'Type conference name here'}
            setValue={setConference}
            validationText={validationText}
          />
          <View style={styles.settingsWrapper}>
            <CustomButton
              title={'Join with audio'}
              onPress={() => startConference()}
              styleFromProps={{wrapper: styles.startConferenceButtonWrapper}}
            />
            <CustomButton
              title={'Join with video'}
              onPress={() => startConference(true)}
              styleFromProps={{wrapper: styles.startConferenceButtonWrapper}}
            />
          </View>
        </View>
      </AvoidKeyboardView>
    </SafeAreaView>
  );
};

export default MainScreen;
