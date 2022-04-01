/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import {StyleSheet} from 'react-native';

import {COLORS} from '../../Utils/constants';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: COLORS.WHITE,
  },
  usernameInput: {
    width: '58%',
    lineHeight: 24,
    fontSize: 20,
  },
  passwordInput: {
    width: '100%',
    lineHeight: 24,
    fontSize: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    lineHeight: 20,
    alignSelf: 'center',
  },
  baseWrapperStyle: {
    marginHorizontal: 16,
    minWidth: '100%',
  },
});
