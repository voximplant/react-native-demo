/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from '../../Screens/Login';
import MainScreen from '../../Screens/Main';
import ConferenceScreen from '../../Screens/Conference';
import Loader from '../../Components/Loader';

import {RootReducer} from '../Store';
import {loginWithToken} from '../Store/login/actions';
import {RootStackParamList} from '../../Utils/types';

const RootStack = createNativeStackNavigator<RootStackParamList>();

const defaultOptions = {
  headerShown: false,
};

const RootNavigator = () => {
  const user = useSelector((store: RootReducer) => store.loginReducer.user);
  const loading = useSelector(
    (store: RootReducer) => store.globalReducer.loading,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loginWithToken());
  }, []);

  return (
    <>
      <RootStack.Navigator
        initialRouteName="Login"
        screenOptions={defaultOptions}>
        {!user ? (
          <RootStack.Screen name={'Login'} component={LoginScreen} />
        ) : (
          <>
            <RootStack.Screen name={'Main'} component={MainScreen} />
            <RootStack.Screen
              name={'Conference'}
              component={ConferenceScreen}
            />
          </>
        )}
      </RootStack.Navigator>
      {loading && <Loader />}
    </>
  );
};

export default RootNavigator;
