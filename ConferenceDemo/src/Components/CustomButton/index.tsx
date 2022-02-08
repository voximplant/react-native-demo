import React, { useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';

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