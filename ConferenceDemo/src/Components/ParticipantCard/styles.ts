import { StyleSheet } from "react-native";
import { COLORS } from "../../Utils/constants";

export default StyleSheet.create({
  participantWrapper: {
    backgroundColor: COLORS.BLACK,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
  },
  activeVoice: {
    borderWidth: 1,
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
    borderWidth: 2,
    borderColor: '#E3E4EB',
    marginLeft: 10,
  },
});