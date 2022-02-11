/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import TouchableOpacity from '../TouchableOpacity';

import { logOutApp } from '../../Core/Store/login/actions';
import { RootReducer } from '../../Core/Store';

import Logout from '../../Assets/Icons/Logout.svg';
import styles from './styles';

const MainHeader = () => {
  const dispatch = useDispatch()
  
  const displayName = useSelector((state: RootReducer) => state.loginReducer.user);

  const logout = () => {
    dispatch(logOutApp());
  };

  return (
    <View style={styles.headerWrapper}>
      <TouchableOpacity onPress={logout} style={styles.logoutButton}>
        <Logout style={styles.logoutButtonIcon} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{displayName}</Text>
      <View style={styles.emptyView} />
    </View>
)};

export default MainHeader;
