/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import {StyleSheet} from 'react-native';

import {COLORS} from '../../Utils/constants';

export default StyleSheet.create({
  wrapper: {
    height: 50,
    borderRadius: 8,
    backgroundColor: COLORS.PRIMARY,
    alignSelf: 'center',
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    lineHeight: 20,
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: COLORS.WHITE,
  },
});
