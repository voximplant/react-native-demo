'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import { CallButton } from './CallButton';

class IncomingCallForm extends Component {

  handleAnswer() {
    this.props.answerCall();
  }

  handleReject() {
    this.props.rejectCall();
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems:'center', justifyContent:'center' }}>
        <Text style={styles.incoming_call}>{this.props.title}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', height: 90 }}>
          <CallButton icon_name='call' color='#0C90E7' buttonPressed={ () => this.handleAnswer() } />
          <CallButton icon_name='call-end' color='#FF3B30' buttonPressed={ () => this.handleReject() } /> 
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  incoming_call: {
    justifyContent:'center',
    alignSelf: 'center',
    fontSize: 18,
  },
});

export {
  IncomingCallForm as IncomingCallForm
} 