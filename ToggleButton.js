'use strict';

import React, {
  StyleSheet,
  Text,
  View,
  Platform
} from 'react-native';
import Button from 'react-native-button';
import { createIconSet } from 'react-native-vector-icons';
var glyphMap = { 
  'speaker': '\uE600',
  'mic-mute': '\uE601',
  'keypad': '\uE602',
  'snd-mute': '\uE603',
  'phone': '\uE604',
  'hangup': '\uE605' 
};
if (Platform.OS == "ios") {
	var Icon = createIconSet(glyphMap, 'icomoon');
} else {
	Icon = createIconSet(glyphMap, 'Custom');
}

class ToggleButton extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			pressed: props.pressed? props.pressed: false
		}
	}

	_onPress() {
		if (!this.state.pressed) {
			this.setState({
				pressed: true
			});
		} else {
			this.setState({
				pressed: false
			});
		}
		if (this.props.onPress) this.props.onPress();
	}

	render() {
		var style, color;
		if (this.state.pressed) {
			style = [this.props.style, styles.pressed];
			color = '#FFFFFF';
		} else {
			style = this.props.style;
			color = this.props.color;
		}
		return <View style={{ width: 70, height: 70 }}>
                  <Icon.Button 
                  	name={this.props.name} 
                  	style={[style, {alignSelf: 'center'}]} 
                  	size={this.props.size} 
                  	color={color}
                  	onPress={(e) => this._onPress(e)}
                  	backgroundColor="transparent"
                  	iconStyle={{marginLeft:9}} />
                </View>;
	}

}

var styles = StyleSheet.create({
	pressed: {
		backgroundColor: '#2B2B2B',
	}
});

export default ToggleButton;