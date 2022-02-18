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
  containerHeight: number;
  containerWidth: number;
  participantsCount: number;
  index: number;
};

const ParticipantCard = ({
  participant,
  containerHeight,
  containerWidth,
  participantsCount,
  index,
}: IProps) => {
  const  { dynamicComputeStyles } = useUtils();

  return (
    <View 
      key={participant.id}
      style={[
        styles.participantWrapper,
        participant.isActiveVoice && styles.activeVoice,
        dynamicComputeStyles(containerHeight, containerWidth, participantsCount, index)
      ]}
    >
      <Voximplant.VideoView
        style={styles.selfview}
        videoStreamId={participant.streamId}
        scaleType={Voximplant.RenderScaleType.SCALE_FIT} // TODO: need to think about SCALE_FILL
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
