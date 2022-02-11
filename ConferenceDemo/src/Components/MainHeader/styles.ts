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
    backgroundColor: COLORS.PRIMARY,
    marginTop: Platform.OS === "ios" ? 34 : 0
  },
  headerTitle: {
    lineHeight: 30,
    fontSize: 20,
    fontWeight: '500',
    alignSelf: 'center',
    color: COLORS.WHITE,
  },
  logoutButton: {
    width: 30,
    height: 30,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoutButtonIcon: {
    minWidth: 25,
    minHeight: 25,
    alignSelf: 'center',
  },
  emptyView: {
    width: 30,
    height: 30,
    alignSelf: 'center',
  },
});
