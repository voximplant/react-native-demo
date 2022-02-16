import { Platform, StyleSheet } from "react-native";

import { COLORS } from "../../Utils/constants";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BLACK,
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#1F1C28',
  },
  bottomControlBar: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        height: 101, // TODO: change styles for ios below 10
      },
      android: {
        height: 77,
      },
    })
  },
  buttonsWrapper: {
    width: 215,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    ...Platform.select({
      ios: {
        marginBottom: 24,
      },
    })
  },
  controlButtonWrapper: {
    borderWidth: 1,
    borderColor: '#E3E4EB',
  },
  controlButtonWrapperHangup: {
    backgroundColor: '#FF7875',
  },
});