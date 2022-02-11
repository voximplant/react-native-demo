import { Platform, TouchableOpacity as TouchableOpacityIOS } from "react-native";
import { TouchableOpacity as TouchableOpacityAndroid } from "react-native-gesture-handler";

const TouchableOpacity = Platform.OS === 'ios' ? TouchableOpacityIOS : TouchableOpacityAndroid;

export default TouchableOpacity;