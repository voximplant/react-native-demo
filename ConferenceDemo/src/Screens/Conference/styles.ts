import { StyleSheet } from "react-native";
import { COLORS } from "../../Utils/constants";

export default StyleSheet.create({
  firstArea: {
    flex: 0,
    backgroundColor: COLORS.BLACK,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#1F1C28',
  },
  bottomControlBar: {
    backgroundColor: 'white',
    height: 77,
    flexDirection: 'row',
    justifyContent: 'center', 
  },
  buttonsWrapper: {
    width: 215,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  controlButtonWrapper: {
    borderWidth: 1,
    borderColor: '#E3E4EB',
  },
  controlButtonWrapperHangup: {
    backgroundColor: '#FF7875',
  },
});