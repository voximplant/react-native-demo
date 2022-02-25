/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import {StyleSheet} from 'react-native';

import {COLORS} from '../../Utils/constants';

export default StyleSheet.create({
  wrapper: {
    width: '100%',
    height: 56,
  },
  wrapperActive: {
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  contentWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 16,
  },
  audioDeviceText: {
    width: 252,
    lineHeight: 20,
    fontSize: 16,
    color: COLORS.DARK_GRAY,
    alignSelf: 'center',
  },
  audioDeviceTextActive: {
    color: COLORS.PURPLE,
  },
  iconDevice: {
    minWidth: 25,
    minHeight: 25,
    alignSelf: 'center',
  },
  markIcon: {
    height: 14,
    width: 14,
    alignSelf: 'center',
  },
});
