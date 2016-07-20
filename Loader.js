'use strict';

import React, { Component } from 'react';

import {
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
  Platform
} from 'react-native';

class Loader extends React.Component {
  render() {

    let indicator;

      indicator = <ActivityIndicator 
          animating={true}
          size="large" />;

    return (
      <View style={styles.loader}>
        {indicator}
        <Text>Establishing connection...</Text>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  loader: {
    flex: 1,    
    justifyContent: 'center',
    alignItems: 'center'   
  }
});

export default Loader;