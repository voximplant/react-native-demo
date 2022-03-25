/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import React, {useEffect, useRef, useState} from 'react';
import {Keyboard, Animated, TouchableWithoutFeedback} from 'react-native';
import styles from './styles';

const AvoidKeyboardView = ({styleFromProps, children}: any) => {
  const [keyboardIsShow, setKeyboardIsShow] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Keyboard.addListener('keyboardWillShow', () => {
      setKeyboardIsShow(true);
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    });
    Keyboard.addListener('keyboardWillHide', () => {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }).start();
      setKeyboardIsShow(false);
    });
    return () => {
      Keyboard.removeAllListeners('keyboardWillShow');
      Keyboard.removeAllListeners('keyboardWillHide');
    };
  }, [keyboardIsShow]);

  const yVal = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -100],
  });

  return (
    <TouchableWithoutFeedback
      style={[styles.contentWrapper, styleFromProps]}
      onPress={() => Keyboard.dismiss()}>
      <Animated.View
        style={[
          styles.contentWrapper,
          {
            transform: [
              {
                translateY: yVal,
              },
            ],
          },
          styleFromProps,
        ]}>
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default AvoidKeyboardView;
