'use strict';

var React = require('react-native');
var Button = require('react-native-button');
var { createIconSet } = require('react-native-vector-icons');
var glyphMap = { 
  'speaker': '\uE600',
  'mic-mute': '\uE601',
  'keypad': '\uE602',
  'snd-mute': '\uE603',
  'phone': '\uE604',
  'hangup': '\uE605' 
};
var Icon = createIconSet(glyphMap, 'icomoon');

var {
  StyleSheet,
  Text
} = React;


var ToggleButton = React.createClass({

	getInitialState: function() {
		return {
			pressed: false
		};
	},

	_onPress: function() {
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
	},

	render: function() {
		var style, color;
		if (this.state.pressed) {
			style = [this.props.style, styles.pressed];
			color = '#FFFFFF';
		} else {
			style = this.props.style;
			color = this.props.color;
		}
		return <Button onPress={this._onPress}>
                  <Icon name={this.props.name} style={style} size={this.props.size} color={color} />
                </Button>;
	}

});

var styles = StyleSheet.create({
	pressed: {
		backgroundColor: '#2B2B2B',
	}
});

module.exports = ToggleButton;