/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import { createStackNavigator, createSwitchNavigator } from 'react-navigation';
import LoginScreen from '../screens/LoginScreen';
import MainScreen from '../screens/MainScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CallScreen from '../screens/CallScreen';
import IncomingCallScreen from '../screens/IncomingCallScreen';

import COLOR from '../styles/Color';

const AppStack = createStackNavigator(
    {
        Main: {
            screen: MainScreen,
        },
        Settings: {
            screen: SettingsScreen,
        },
    },
    {
        headerLayoutPreset: 'center',
        navigationOptions: {
            headerStyle: {
                backgroundColor: COLOR.PRIMARY,
            },
            headerTintColor: COLOR.WHITE,
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        },
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

export default RootStack;
