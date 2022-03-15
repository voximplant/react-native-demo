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
  settingsWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-around',
  },
  settingsText: {
    color: COLORS.BLACK,
    alignSelf: 'center',
    marginRight: 20,
    lineHeight: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  startConferenceButtonWrapper: {
    width: 160,
  },
});
