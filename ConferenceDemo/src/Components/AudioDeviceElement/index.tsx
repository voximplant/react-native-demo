/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity} from "react-native";

import MarkIcon from '../../Assets/Icons/markIcon.svg';
import styles from "./styles";

interface IProps {
  Icon: any;
  IconActive: any;
  isActive: boolean;
  text: string;
  typeForSelect: string;
  onPress: (text: string) => void;
};

const AudioDeviceElement = ({Icon, IconActive, isActive, text, typeForSelect, onPress}: IProps) => {
  const selectNewAudioDevice = () => {
    onPress(typeForSelect);
  };

  return (
    <TouchableOpacity
      style={[styles.wrapper, isActive && styles.wrapperActive]}
      onPress={selectNewAudioDevice}
    >
        <View style={styles.contentWrapper}>
          {isActive ? <IconActive style={styles.iconDevice} /> : <Icon style={styles.iconDevice} />}
          <Text style={[styles.audioDeviceText, isActive && styles.audioDeviceTextActive]}>{text}</Text>
          {isActive ? <MarkIcon style={styles.markIcon} /> : <View style={styles.markIcon} />}
        </View>
    </TouchableOpacity>
  );
};

export default AudioDeviceElement;
