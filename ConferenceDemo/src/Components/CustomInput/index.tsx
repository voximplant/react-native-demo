/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import React from 'react';
import {Text, View, TextInput, Keyboard} from 'react-native';

import styles from './styles';

interface IProps {
  inputRef?: any;
  inputRefFocus?: any;
  title: string;
  value: string;
  setValue: (value: string) => void;
  isPassword?: boolean;
  isLogin?: boolean;
  validationText?: string;
  placeholder: string;
  styleFromProps?: {
    mainWrapper?: object;
    title?: object;
    input?: object;
  };
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
  inputRef,
  inputRefFocus,
}: IProps) => {
  return (
    <View style={[styles.inputWrapper, styleFromProps?.mainWrapper]}>
      <Text style={[styles.inputTitle, styleFromProps?.title]}>{title}</Text>
      <View
        style={[
          styles.inputWrapperWithSuffix,
          !!validationText && styles.inputWrapperWithError,
        ]}>
        <TextInput
          ref={inputRef}
          value={value}
          autoCapitalize={'none'}
          autoCorrect={false}
          secureTextEntry={isPassword}
          style={[styles.input, styleFromProps?.input]}
          placeholder={placeholder}
          returnKeyType={inputRefFocus ? 'next' : 'done'}
          placeholderTextColor="gray"
          onChangeText={text => setValue(text)}
          onSubmitEditing={() =>
            inputRefFocus ? inputRefFocus.current.focus() : Keyboard.dismiss()
          }
          blurOnSubmit={false}
        />
        {isLogin && <Text style={styles.suffixText}>.voximplant.com</Text>}
      </View>
      {!!validationText && (
        <Text style={styles.errorText}>{validationText}</Text>
      )}
    </View>
  );
};

export default CustomInput;
