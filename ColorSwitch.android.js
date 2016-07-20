'use strict';

import React, { Component } from 'react';

import {
  SwitchAndroid,
  Text,
  View
} from 'react-native';
var update = require('react-addons-update');

var ColorSwitch = React.createClass({
  getInitialState() {
    return {
      colorTrueSwitchIsOn: true,
      colorFalseSwitchIsOn: false,
    };
  },
  componentDidMount() {
    if (this.props.defaultValue) {
      this.setState(update(
        this.state, 
        { 
          $merge: {
            colorFalseSwitchIsOn: this.props.defaultValue
          }
        }));
    }
  },
  componentDidUpdate(prevProps, prevState) {
  	if (this.props.valueUpdate) this.props.valueUpdate(this.state.colorFalseSwitchIsOn);
  },
  render() {
    return (
      <View>
        <SwitchAndroid
          onValueChange={(value) => this.setState({colorFalseSwitchIsOn: value})}
          onTintColor="#00ff00"
          tintColor="#ff0000"
          value={this.state.colorFalseSwitchIsOn} />
      </View>
    );
  },
});

module.exports = ColorSwitch;