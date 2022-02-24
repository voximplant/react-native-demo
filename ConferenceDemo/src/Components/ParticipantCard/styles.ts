/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import { StyleSheet } from "react-native";

import { COLORS } from "../../Utils/constants";

export default StyleSheet.create({
  participantWrapper: {
    backgroundColor: COLORS.BLACK,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    margin: 2,
  },
  activeVoice: {
    borderWidth: 2,
    borderColor: COLORS.MINT,
  },
  selfview: {
    backgroundColor: COLORS.BLACK,
    flex: 1,
  },
  participantWrapperInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 5,
    position: 'absolute',
    bottom: 0,
  },
  participantText: {
    lineHeight: 30,
    fontSize: 14,
    color: COLORS.WHITE,
    fontWeight: '800',
  },
  participantIconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: 10,
  },
  participantIcon: {
    minHeight: 25,
    minWidth: 25,
    alignSelf: 'center',
  },
});