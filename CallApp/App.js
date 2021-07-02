/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import LoginScreen from './src/LoginScreen';
import MainScreen from './src/MainScreen';
import CallScreen from './src/CallScreen';
import IncomingCallScreen from './src/IncomingCallScreen';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{headerLeft: null}}
        />
        <Stack.Screen
          name="Call"
          component={CallScreen}
          options={{headerLeft: null}}
        />
        <Stack.Screen
          name="IncomingCall"
          component={IncomingCallScreen}
          options={{headerLeft: null}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
