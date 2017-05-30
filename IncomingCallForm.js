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

  render() {
    return (
      <View style={{ flex: 1, alignItems:'center', justifyContent:'center' }}>
        <Text style={styles.incoming_call}>{this.state.callState}</Text>
        <View style={{ flexDirection: 'row', width: 200, height: 90, alignSelf: 'center', margin: 20 }}>
          <CallButton icon_name='call' color='#0C90E7' buttonPressed={ () => this.answerCall() } />
          <CallButton icon_name='call-end' color='#FF3B30' buttonPressed={ () => this.rejectCall() } /> 
        </View>
      </View>
    );
  }
}

export {
  IncomingCallForm as IncomingCallForm
} 