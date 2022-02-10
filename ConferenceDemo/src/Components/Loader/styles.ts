/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    backgroundColor: 'rgba(228,232,240, 0.8)',
  },
  loaderWrapper: {
    width: 100,
    height: 100,
    borderRadius: 16,
    // backgroundColor: 'rgb(240,240,240)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  loader: {
    alignSelf: 'center',
  },
});