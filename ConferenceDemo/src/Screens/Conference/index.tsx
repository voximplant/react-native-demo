/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import React, { useEffect } from 'react';
import { StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
//@ts-ignore
import {Voximplant} from 'react-native-voximplant';
import { useDispatch, useSelector } from 'react-redux';

import ControlButton from '../../Components/ControlButton';
import ConferenceHeader from '../../Components/ConferenceHeader';

import { COLORS } from '../../Utils/constants';
import { IScreenProps } from '../../Utils/types';
import { ConferenceService } from '../../Core/Services/ConferenceService';
import { RootReducer } from '../../Core/Store';
import { toggleIsLocalVideo, toggleIsMuted } from '../../Core/Store/conference/actions';

import PhoneIcon from '../../Assets/Icons/Phone.svg';
import MicrophoneIcon from '../../Assets/Icons/Microphone.svg';
import MicrophoneIconDisable from '../../Assets/Icons/MicrophoneDisable.svg';
import VideocameraIcon from '../../Assets/Icons/Videocamera.svg';
import VideocameraIconDisable from '../../Assets/Icons/VideocameraDisable.svg';
import styles from './styles';

const ConferenceScreen = ({ route }: IScreenProps<'Conference'>) => {
  const { conference } = route.params;
  const dispatch = useDispatch();
  const isSendVideo = useSelector((state: RootReducer) => state.conferenceReducer.sendLocalVideo);
  const isMuted = useSelector((state: RootReducer) => state.conferenceReducer.isMuted);

  const participants = useSelector((state: RootReducer) => state.conferenceReducer.participants);
  const { startConference, endConference, muteAudio, sendLocalVideo } = ConferenceService();
  
  useEffect(() => {
    startConference(conference, isSendVideo);
  }, []);

  const toggleMuteAudio = () => {
    dispatch(toggleIsMuted());
    muteAudio(isMuted);
  };

  const toggleLocalVideo = async () => {
    dispatch(toggleIsLocalVideo());
    await sendLocalVideo(!isSendVideo);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle={'light-content'} backgroundColor={COLORS.BLACK} />
      <ConferenceHeader />
       <View style={styles.videoContainer}>
        {participants?.map((el) => {
          return el.streamId ? (
          <Voximplant.VideoView
            key={el.id}
            style={styles.selfview}
            videoStreamId={el.streamId}
            scaleType={Voximplant.RenderScaleType.SCALE_FIT}
            showOnTop={true}
          />
          ) : (
          <View key={el.id} style={styles.withoutLocalVideo} />
        )})}
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
