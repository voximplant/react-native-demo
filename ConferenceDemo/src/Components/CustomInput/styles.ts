/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import { StyleSheet } from "react-native";

import { COLORS } from "../../Utils/constants";

export default StyleSheet.create({
  inputWrapper: {
    alignSelf: 'center',
    marginVertical: 10,
    width: '100%',
    height: 80,
  },
  inputTitle: {
    lineHeight: 20,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputWrapperWithSuffix: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.BLUE,
  },
  input: {
    paddingLeft: 10,
    lineHeight: 20,
    fontSize: 16,
    width: '100%',
    color: COLORS.BLACK,
  },
  errorText: {
    color: COLORS.RED,
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 10,
  },
  suffixText: {
    lineHeight: 20,
    fontSize: 16,
    paddingRight: 10,
  },
})