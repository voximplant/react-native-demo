import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import RootNavigator from './Router';


const App = () => {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default App;
