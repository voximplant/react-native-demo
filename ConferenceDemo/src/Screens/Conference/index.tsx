/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import React, {useEffect, useState} from 'react';
import {StatusBar, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import ControlButton from '../../Components/ControlButton';
import ConferenceHeader from '../../Components/ConferenceHeader';
import ParticipantCard from '../../Components/ParticipantCard';
import ModalAudioDevices from '../../Components/ModalAudioDevices';

import {COLORS} from '../../Utils/constants';
import {IScreenProps, ScreenNavigationProp} from '../../Utils/types';
import {ConferenceService} from '../../Core/Services/ConferenceService';
import {RootReducer} from '../../Core/Store';
import {toggleSendVideo, toggleMute} from '../../Core/Store/conference/actions';
import {useUtils} from '../../Utils/useUtils';

import PhoneIcon from '../../Assets/Icons/Phone.svg';
import MicrophoneIcon from '../../Assets/Icons/Microphone.svg';
import MicrophoneIconDisable from '../../Assets/Icons/MicrophoneDisable.svg';
import VideocameraIcon from '../../Assets/Icons/Videocamera.svg';
import VideocameraIconDisable from '../../Assets/Icons/VideocameraDisable.svg';
import styles from './styles';

const ConferenceScreen = ({route}: IScreenProps<'Conference'>) => {
  const {conference} = route.params;
  const dispatch = useDispatch();
  const {isAndroid, isIOS, checkAndroidCameraPermission} = useUtils();
  const navigation = useNavigation<ScreenNavigationProp<'Main'>>();
  const {
    startConference,
    endConference,
    muteAudio,
    sendLocalVideo,
    getAudioDevices,
    getActiveDevice,
  } = ConferenceService();
  const {dynamicComputeStyles} = useUtils();

  const {isMuted, callState, participants, isSendVideo} = useSelector(
    (state: RootReducer) => state.conferenceReducer,
  );
  const [containerHeight, setContainerHeight] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    startConference(conference, isSendVideo);
    getAudioDevices();
    getActiveDevice();
  }, []);

  useEffect(() => {
    if (callState === 'Disconnected' || callState === 'Failed') {
      navigation.navigate('Main');
    }
  }, [callState]);

  const toggleMuteAudio = () => {
    dispatch(toggleMute());
    muteAudio(isMuted);
  };

  const toggleLocalVideo = async () => {
    let result;
    if (isAndroid) {
      try {
        result = await checkAndroidCameraPermission();
      } catch (error) {
        console.warn('Something was wrong with android permissions...');
      }
    }
    if (result || isIOS) {
      await sendLocalVideo(!isSendVideo);
      dispatch(toggleSendVideo());
    }
  };

  const toggleModalAudioDevices = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle={'light-content'} backgroundColor={COLORS.BLACK} />
      <ConferenceHeader toggleModalAudioDevices={toggleModalAudioDevices} />
      <View
        style={styles.videoContainer}
        onLayout={({nativeEvent}) => {
          const {width, height} = nativeEvent.layout;
          setContainerHeight(height);
          setContainerWidth(width);
        }}>
        {participants?.map((el, index) => {
          const participantsCount = participants.length;
          const stylesForCard = dynamicComputeStyles(
            containerWidth,
            containerHeight,
            participantsCount,
            index,
          );
          const stylesForLastCard =
            index === 4 && participantsCount === 5
              ? {marginLeft: containerWidth / 4}
              : {};
          return (
            index <= 5 && (
              <ParticipantCard
                key={el.id}
                participant={el}
                stylesForCard={stylesForCard}
                stylesForLastCard={stylesForLastCard}
              />
            )
          );
        })}
      </View>
      <View style={styles.bottomControlBar}>
        <View style={styles.buttonsWrapper}>
          <ControlButton
            Icon={isSendVideo ? VideocameraIcon : VideocameraIconDisable}
            onPress={toggleLocalVideo}
            styleFromProps={{
              wrapper: styles.controlButtonWrapper,
            }}
          />
          <ControlButton
            Icon={isMuted ? MicrophoneIconDisable : MicrophoneIcon}
            onPress={toggleMuteAudio}
            styleFromProps={{
              wrapper: styles.controlButtonWrapper,
            }}
          />
          <ControlButton
            Icon={PhoneIcon}
            onPress={endConference}
            styleFromProps={{
              wrapper: styles.controlButtonWrapperHangup,
            }}
          />
        </View>
      </View>
      <ModalAudioDevices
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </SafeAreaView>
  );
};

export default ConferenceScreen;
