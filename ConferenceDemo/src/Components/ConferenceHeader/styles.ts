/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import {StyleSheet} from 'react-native';

import {COLORS} from '../../Utils/constants';

export default StyleSheet.create({
  headerWrapper: {
    height: 52,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.BLACK,
  },
  headerTitle: {
    lineHeight: 20,
    fontSize: 16,
    fontWeight: '500',
    alignSelf: 'center',
    color: COLORS.WHITE,
  },
  buttonWrapper: {
    maxWidth: 30,
    maxHeight: 30,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonIcon: {
    minWidth: 29,
    minHeight: 29,
    alignSelf: 'center',
  },
});
