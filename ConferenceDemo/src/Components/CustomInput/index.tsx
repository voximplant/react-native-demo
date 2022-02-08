import React, { useState } from 'react';
import { RefObject } from 'react';
import { Text, View, TextInput } from 'react-native';

import styles from './styles';

interface IProps {
  refer?: RefObject<TextInput>;
  title: string;
  value: string;
  setValue: (value: string) => void;
  isPassword?: boolean;
  isLogin?: boolean;
  placeholder: string;
  styleFromProps?: {
    mainWrapper?: object,
    title?: object,
    input?: object,
  }
}
const CustomInput = ({
  refer,
  title,
  value,
  setValue,
  isPassword,
  isLogin,
  styleFromProps,
  placeholder,
}: IProps) => {
  return(
    <View style={[styles.inputWrapper, styleFromProps?.mainWrapper]}>
      <Text style={[styles.inputTitle, styleFromProps?.title]}>{title}</Text>
      <View style={styles.inputWrapperWithSuffix}>
        <TextInput
          ref={refer}
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
    </View>
  );
};

export default CustomInput;