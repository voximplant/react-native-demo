/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import React from 'react';
import {SvgProps} from 'react-native-svg';

import {TouchableOpacity} from 'react-native';

import styles from './styles';

interface IProps {
  Icon: React.FC<SvgProps>;
  onPress: () => void;
  styleFromProps?: {
    wrapper?: object;
    icon?: object;
  };
}

const ControlButton = ({Icon, onPress, styleFromProps}: IProps) => {
  return (
    <TouchableOpacity
      style={[styles.iconWrapper, styleFromProps?.wrapper]}
      onPress={onPress}>
      <Icon style={[styles.icon, styleFromProps?.icon]} />
    </TouchableOpacity>
  );
};

export default ControlButton;
