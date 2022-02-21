/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import { StyleSheet } from "react-native";

export default StyleSheet.create({
  wrapper: {
    width: '100%',
    height: 56,
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
    color: '#1F1C28',
    alignSelf: 'center',
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
