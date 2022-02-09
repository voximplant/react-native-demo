/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import { StyleSheet } from "react-native";

import { COLORS } from "../../Utils/constants";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 16,
  },
  usernameInput: {
    width: '60%',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    lineHeight: 20,
    alignSelf: 'center',
  },
});
