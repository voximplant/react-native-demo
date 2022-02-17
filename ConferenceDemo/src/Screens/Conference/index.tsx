/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import React, { useEffect, useState } from 'react';
import { StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import ControlButton from '../../Components/ControlButton';
import ConferenceHeader from '../../Components/ConferenceHeader';
import ParticipantCard from '../../Components/ParticipantCard';

import { COLORS } from '../../Utils/constants';
import { IScreenProps, ScreenNavigationProp } from '../../Utils/types';
import { ConferenceService } from '../../Core/Services/ConferenceService';
import { RootReducer } from '../../Core/Store';
import { toggleIsMuted } from '../../Core/Store/conference/actions';

import PhoneIcon from '../../Assets/Icons/Phone.svg';
import MicrophoneIcon from '../../Assets/Icons/Microphone.svg';
import MicrophoneIconDisable from '../../Assets/Icons/MicrophoneDisable.svg';
import VideocameraIcon from '../../Assets/Icons/Videocamera.svg';
import VideocameraIconDisable from '../../Assets/Icons/VideocameraDisable.svg';
import styles from './styles';

const ConferenceScreen = ({ route }: IScreenProps<'Conference'>) => {
  const { conference } = route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation<ScreenNavigationProp<'Main'>>();
  const { startConference, endConference, muteAudio, sendLocalVideo } = ConferenceService();

  const isSendVideo = useSelector((state: RootReducer) => state.conferenceReducer.sendLocalVideo);
  const isMuted = useSelector((state: RootReducer) => state.conferenceReducer.isMuted);
  const callState = useSelector((state: RootReducer) => state.conferenceReducer.callState);
  const participants = useSelector((state: RootReducer) => state.conferenceReducer.participants);
  const [containerHeight, setContainerHeight] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    startConference(conference, isSendVideo);
  }, []);

  useEffect(() => {
    if (callState === 'Disconnected') {
      navigation.navigate('Main');
    }
  }, [callState]);

  const toggleMuteAudio = () => {
    dispatch(toggleIsMuted());
    muteAudio(isMuted);
  };

  const toggleLocalVideo = async () => {
    await sendLocalVideo(isSendVideo);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle={'light-content'} backgroundColor={COLORS.BLACK} />
      <ConferenceHeader />
      <View style={styles.videoContainer} onLayout={({ nativeEvent }) => {
          const { width, height } = nativeEvent.layout;
          setContainerHeight(height);
          setContainerWidth(width);
      }}>
        {participants?.map((el, index) => {
          const participantsCount = participants.length;
          return index <= 5 && (
            <ParticipantCard
              participant={el}
              containerHeight={containerHeight}
              containerWidth={containerWidth}
              participantsCount={participantsCount}
              index={index}
            />
          )
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
    </SafeAreaView>
  );
};

export default ConferenceScreen;
