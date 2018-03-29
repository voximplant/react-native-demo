/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import { StackNavigator } from 'react-navigation';
import LoginScreen from '../screens/LoginScreen';
import MainScreen from '../screens/MainScreen';

const RootStack = StackNavigator(
    {
        Login: {
            screen: LoginScreen,
        },
        Main: {
            screen: MainScreen,
        },
    },
    {
        initialRouteName: 'Login',
    }
);

export default RootStack;

