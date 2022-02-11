/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import React from 'react';
import { Text } from 'react-native';

import TouchableOpacity from '../TouchableOpacity';

import styles from './styles';

interface IProps {
  title: string;
  onPress: () => void;
  styleFromProps?: {
    wrapper?: object,
    title?: object,
  }
}
const CustomButton = ({ title, onPress, styleFromProps }: IProps) => {
  return(
    <TouchableOpacity style={[styles.wrapper, styleFromProps?.wrapper]} onPress={onPress}>
      <Text style={[styles.title, styleFromProps?.title]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;