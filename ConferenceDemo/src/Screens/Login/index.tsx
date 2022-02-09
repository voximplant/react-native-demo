/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import CustomButton from '../../Components/CustomButton';
import CustomInput from '../../Components/CustomInput';

import { RootReducer } from '../../Core/Store';
import { clearErrors } from '../../Core/Store/global/actions';
import { loginWithPass } from '../../Core/Store/login/actions';
import { useUtils } from '../../Utils/useUtils';

import styles from './styles';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const { showAllert } = useUtils();

  const error = useSelector((store: RootReducer) =>  store.loginReducer.error);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const login = () => {
    dispatch(loginWithPass(userName, password));
  };

  useEffect(() => {
    if (error?.other) {
      showAllert(error.other);
    }
  }, [error]);

  useEffect(() => {
    dispatch(clearErrors());
  }, [userName, password]);

  return (
    <View style={styles.container}>
      <CustomInput
        title={'Login'}
        value={userName}
        isLogin
        validationText={error?.login}
        setValue={setUserName}
        placeholder={'user@app.account'}
        styleFromProps={{
          input: styles.usernameInput,
        }}
      />
      <CustomInput
        title={'Password'}
        value={password}
        isPassword
        validationText={error?.password}
        placeholder={'password'}
        setValue={setPassword}
      />
      <CustomButton
        title={"Login"}
        onPress={login}
      />
    </View>
  );
};

export default LoginScreen;
