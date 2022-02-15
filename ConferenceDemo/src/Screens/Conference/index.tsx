/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import React, { useEffect } from 'react';
import { StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
//@ts-ignore
import {Voximplant} from 'react-native-voximplant';

import ControlButton from '../../Components/ControlButton';
import ConferenceHeader from '../../Components/ConferenceHeader';

import { COLORS } from '../../Utils/constants';
import { IScreenProps } from '../../Utils/types';
import { CallService } from '../../Core/Services/CallService';

import PhoneIcon from '../../Assets/Icons/Phone.svg';
import MicrophoneIcon from '../../Assets/Icons/Microphone.svg';
import VideocameraIcon from '../../Assets/Icons/Videocamera.svg';
import styles from './styles';

const ConferenceScreen = ({ route }: IScreenProps<'Conference'>) => {
  const { localVideo, conference } = route.params;
  const { localVideoStreamId, remoteVideoStreamIds, startConference, endConference, muteAudio, isMuted, sendVideo } = CallService();

  
  useEffect(() => {
    startConference(conference, localVideo);
  }, []);

  console.log('remoteVideoStreamIds', remoteVideoStreamIds);
  
  const renderRemote = () => {
    remoteVideoStreamIds.forEach((el) =>{
      <Voximplant.VideoView
        style={styles.selfview}
        videoStreamId={el}
        scaleType={Voximplant.RenderScaleType.SCALE_FIT}
      />
    })
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle={'light-content'} backgroundColor={COLORS.BLACK} />
      <ConferenceHeader />
      <View style={styles.videoContainer}>
          {renderRemote()}
          <Voximplant.VideoView
            style={styles.selfview}
            videoStreamId={localVideoStreamId}
            scaleType={Voximplant.RenderScaleType.SCALE_FIT}
            showOnTop={true}
          />
      </View>
      <View style={styles.bottomControlBar}> 
        <View style={styles.buttonsWrapper}>
          <ControlButton
            Icon={VideocameraIcon}
            onPress={() => sendVideo(localVideo)}
            styleFromProps={{
              wrapper: styles.controlButtonWrapper,
            }}
          />
          <ControlButton
            Icon={MicrophoneIcon}
            onPress={muteAudio}
            styleFromProps={{
              wrapper: 
              isMuted 
              ? styles.controlButtonWrapperDisable
              : styles.controlButtonWrapper,
            }}
          />
          <ControlButton
            Icon={PhoneIcon}
            onPress={() => endConference()}
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
