/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';

import RootNavigator from './Core/Router';
import {store} from './Core/Store';

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
