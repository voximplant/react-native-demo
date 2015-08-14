'use strict';

var React = require('react-native');

var {
  ActivityIndicatorIOS,
  Text,
  View,
  StyleSheet
} = React;

var Loader = React.createClass({
  render: function() {
    return (
      <View style={styles.loader}>
        <ActivityIndicatorIOS 
          animating="true"
          size="large" />
        <Text>Establishing connection...</Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  loader: {
    flex: 1,    
    justifyContent: 'center',
    alignItems: 'center'   
  }
});

module.exports = Loader;