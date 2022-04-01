/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import {StyleSheet} from 'react-native';

import {COLORS} from '../../Utils/constants';

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
    height: 58,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.PURPLE,
  },
  inputWrapperWithError: {
    borderColor: 'red',
  },
  input: {
    paddingLeft: 10,
    lineHeight: 24,
    fontSize: 20,
    width: '100%',
    height: 50,
    color: COLORS.BLACK,
  },
  errorText: {
    color: COLORS.RED,
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 10,
  },
  suffixText: {
    lineHeight: 24,
    fontSize: 20,
    paddingRight: 10,
  },
});
