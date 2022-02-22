/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import React from "react";
import { View, Text } from "react-native";
//@ts-ignore
import {Voximplant} from 'react-native-voximplant';

import { IParticipant } from "../../Utils/types";
import { useUtils } from "../../Utils/useUtils";

import MicrophoneIconDisable from '../../Assets/Icons/MicrophoneDisable.svg';
import styles from "./styles";

interface IProps {
  participant: IParticipant,
  stylesForCard: object;
  stylesForLastCard: object;
};

const ParticipantCard = ({participant, stylesForCard, stylesForLastCard}: IProps) => {
  const isActiveVoice = true;

  return (
    <View style={[
      styles.participantWrapper,
      isActiveVoice && styles.activeVoice,
      stylesForCard,
      stylesForLastCard,
    ]}>
      <Voximplant.VideoView
        style={styles.selfview}
        videoStreamId={participant.streamId}
        scaleType={Voximplant.RenderScaleType.SCALE_FILL}
        showOnTop={true}
      />
      <View style={styles.participantWrapperInfo}>
        <Text style={styles.participantText}>{participant.name || 'Username'}</Text>
        <View style={styles.participantIconWrapper}>
          <MicrophoneIconDisable />
        </View>
      </View>
    </View>
  );
};

export default ParticipantCard;
