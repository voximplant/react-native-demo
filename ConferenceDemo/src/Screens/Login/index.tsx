/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import React, {useEffect, useRef, useState} from 'react';
import {StatusBar, View} from 'react-native';
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
  const secondInputRef = useRef();

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
      <View style={styles.contentWrapper}>
        <StatusBar
          barStyle={'light-content'}
          backgroundColor={COLORS.PRIMARY}
        />
        <AvoidKeyboardView>
          <CustomInput
            inputRefFocus={secondInputRef}
            title={'Login'}
            value={userName}
            isLogin
            validationText={error?.login}
            setValue={setUserName}
            placeholder={'user@app.account'}
            styleFromProps={{
              input: styles.usernameInput,
              mainWrapper: styles.baseWrapperStyle,
            }}
          />
          <CustomInput
            inputRef={secondInputRef}
            title={'Password'}
            value={password}
            isPassword
            validationText={error?.password}
            placeholder={'password'}
            setValue={setPassword}
            styleFromProps={{
              input: styles.passwordInput,
              mainWrapper: styles.baseWrapperStyle,
            }}
          />
          <CustomButton
            title={'Login'}
            onPress={login}
            styleFromProps={{
              wrapper: styles.baseWrapperStyle,
            }}
          />
        </AvoidKeyboardView>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
