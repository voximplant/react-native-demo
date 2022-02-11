/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import { Platform, StyleSheet } from "react-native";

import { COLORS } from "../../Utils/constants";

export default StyleSheet.create({
  headerWrapper: {
    height: 52,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.BLACK,
    marginTop: Platform.OS === "ios" ? 34 : 0
  },
  headerTitle: {
    lineHeight: 20,
    fontSize: 16,
    fontWeight: '500',
    alignSelf: 'center',
    color: COLORS.WHITE,
  },
  buttonWrapper: {
    width: 30,
    height: 30,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonIcon: {
    minWidth: 25,
    minHeight: 25,
    alignSelf: 'center',
  },
});
