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
  }
});
