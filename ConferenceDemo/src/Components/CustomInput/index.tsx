/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import React from 'react';
import { Text, View, TextInput } from 'react-native';

import styles from './styles';

interface IProps {
  title: string;
  value: string;
  setValue: (value: string) => void;
  isPassword?: boolean;
  isLogin?: boolean;
  validationText?: string;
  placeholder: string;
  styleFromProps?: {
    mainWrapper?: object,
    title?: object,
    input?: object,
  }
}
const CustomInput = ({
  title,
  value,
  setValue,
  isPassword,
  isLogin,
  validationText,
  styleFromProps,
  placeholder,
}: IProps) => {
  return(
    <View style={[styles.inputWrapper, styleFromProps?.mainWrapper]}>
      <Text style={[styles.inputTitle, styleFromProps?.title]}>{title}</Text>
      <View style={[styles.inputWrapperWithSuffix, !!validationText && {borderColor: 'red'}]}>
        <TextInput
          value={value}
          autoCapitalize={'none'}
          autoCorrect={false}
          secureTextEntry={isPassword}
          style={[styles.input, styleFromProps?.input]}
          placeholder={placeholder}
          placeholderTextColor='gray'
          onChangeText={(text) => setValue(text)}
        />
        {isLogin && <Text style={styles.suffixText}>.voximplant.com</Text>}
      </View>
      {!!validationText && <Text style={styles.errorText}>{validationText}</Text>}
    </View>
  );
};

export default CustomInput;