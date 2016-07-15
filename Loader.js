'use strict';

import React from 'react';
import {
  ActivityIndicatorIOS,
  ProgressBarAndroid,
  Text,
  View,
  StyleSheet,
  Platform
} from 'react-native';

class Loader extends React.Component {
  render() {

    let indicator;

    if (Platform.OS == "ios") {
      indicator = <ActivityIndicatorIOS 
          animating={true}
          size="large" />;
    } else {
      indicator = <ProgressBarAndroid styleAttr="Inverse" />;
    }

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