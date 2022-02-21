/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import { StyleSheet } from "react-native";
import { COLORS } from "../../Utils/constants";

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
  },
  headerText: {
    marginTop: 26,
    marginLeft: 16,
    lineHeight: 28,
    marginBottom: 16,
    fontSize: 24,
    fontWeight: '500',
    color: '#2E283D',
  }
});
