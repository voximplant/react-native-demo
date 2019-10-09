/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import LoginScreen from '../screens/LoginScreen';
import MainScreen from '../screens/MainScreen';
import CallScreen from '../screens/CallScreen';
import IncomingCallScreen from '../screens/IncomingCallScreen';

import COLOR from '../styles/Color';

const AppStack = createStackNavigator(
    {
        Main: {
            screen: MainScreen,
            navigationOptions: {
                headerStyle: {
                    backgroundColor: COLOR.PRIMARY,
                },
                headerTintColor: COLOR.WHITE,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            },
        },
    },
    {
        headerLayoutPreset: 'center',
    }
);

const RootStack = createSwitchNavigator(
    {
        Login: LoginScreen,
        App: AppStack,
        Call: CallScreen,
        IncomingCall: IncomingCallScreen,
    },
    {
        initialRouteName: 'Login',
    }
);

export default createAppContainer(RootStack);
