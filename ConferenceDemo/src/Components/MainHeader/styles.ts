/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import { StyleSheet } from "react-native";

import { COLORS } from "../../Utils/constants";

export default StyleSheet.create({
  headerWrapper: {
    height: 70,
    paddingHorizontal: 20,
    paddingTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.PRIMARY,
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
