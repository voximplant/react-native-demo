/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import React, {useEffect, useState} from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';

import CustomButton from '../../Components/CustomButton';
import CustomInput from '../../Components/CustomInput';
import AvoidKeyboardView from '../../Components/AvoidKeyboardView';

import {RootReducer} from '../../Core/Store';
import {clearErrors} from '../../Core/Store/global/actions';
import {loginWithPass} from '../../Core/Store/login/actions';
import {COLORS, STORAGE} from '../../Utils/constants';
import {useUtils} from '../../Utils/useUtils';
import {StorageService} from '../../Core/Services/StorageService';

import styles from './styles';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const {showAllert} = useUtils();

  const error = useSelector((store: RootReducer) => store.loginReducer.error);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const login = () => {
    dispatch(loginWithPass(userName, password));
  };

  const getLastLoggedInUser = async () => {
    const name = await StorageService().getStorageItem(STORAGE.USER_NAME);
    if (name) {
      setUserName(name);
    }
  };

  useEffect(() => {
    getLastLoggedInUser();
  }, []);

  useEffect(() => {
    if (error?.other) {
      showAllert(error.other);
    }
  }, [error]);

  useEffect(() => {
    dispatch(clearErrors());
  }, [userName, password]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AvoidKeyboardView styleFromProps={styles.contentWrapper}>
        <StatusBar
          barStyle={'light-content'}
          backgroundColor={COLORS.PRIMARY}
        />
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
        <CustomButton title={'Login'} onPress={login} />
      </AvoidKeyboardView>
    </SafeAreaView>
  );
};

export default LoginScreen;
