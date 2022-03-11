/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import {Platform, StyleSheet} from 'react-native';

import {COLORS} from '../../Utils/constants';

export default StyleSheet.create({
  wrapperContent: {
    position: 'absolute',
    height: 'auto',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    ...Platform.select({
      // TODO: think about styles IPhone with tiuch button
      ios: {
        marginBottom: 24,
      },
    }),
  },
  headerText: {
    marginTop: 26,
    marginLeft: 16,
    lineHeight: 28,
    marginBottom: 16,
    fontSize: 24,
    fontWeight: '500',
    color: COLORS.DARK_GRAY,
  },
  swipeWrapper: {
    position: 'absolute',
    alignSelf: 'center',
    width: 150,
    height: 30,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  swipeIcon: {
    alignSelf: 'center',
  },
});
