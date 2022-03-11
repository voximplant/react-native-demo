/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import React, {useState} from 'react';
import {View, Switch, Text, StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';

import CustomInput from '../../Components/CustomInput';
import CustomButton from '../../Components/CustomButton';
import MainHeader from '../../Components/MainHeader';

import {IScreenProps} from '../../Utils/types';
import {COLORS} from '../../Utils/constants';
import {useUtils} from '../../Utils/useUtils';
import {
  changeCallState,
  toggleSendVideo,
} from '../../Core/Store/conference/actions';

import styles from './styles';
import {RootReducer} from '../../Core/Store';

const MainScreen = ({navigation}: IScreenProps<'Main'>) => {
  const dispatch = useDispatch();
  const {
    isIOS,
    isAndroid,
    checkAndroidMicrophonePermission,
    checkAndroidCameraPermission,
  } = useUtils();
  const sendVideo = useSelector(
    (state: RootReducer) => state.conferenceReducer.isSendVideo,
  );

  const [conference, setConference] = useState('');

  const toggleVideo = () => {
    dispatch(toggleSendVideo());
  };

  const startConference = async () => {
    let resultAudio;
    let resultVideo;
    if (isAndroid) {
      try {
        resultAudio = await checkAndroidMicrophonePermission();
        if (sendVideo) {
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
      <StatusBar barStyle={'light-content'} backgroundColor={COLORS.PRIMARY} />
      <MainHeader />
      <View style={styles.contentWrapper}>
        <CustomInput
          title={'Conference name'}
          value={conference}
          placeholder={'.....'}
          setValue={setConference}
        />
        <View style={styles.settingsWrapper}>
          <Text style={styles.settingsText}>Send local video:</Text>
          <Switch
            trackColor={{false: '#767577', true: '#54FF00'}}
            onValueChange={toggleVideo}
            value={sendVideo}
          />
        </View>
        <CustomButton title={'Start conference'} onPress={startConference} />
      </View>
    </SafeAreaView>
  );
};

export default MainScreen;
