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
    backgroundColor: COLORS.BLACK,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '500',
    alignSelf: 'center',
    color: COLORS.WHITE,
  },
  buttonWrapper: {
    width: 30,
    height: 30,
    alignSelf: 'center',
  },
  buttonIcon: {
    minWidth: 25,
    minHeight: 25,
    alignSelf: 'center',
  },
});
