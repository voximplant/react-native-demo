import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from '../Screens/Login';
import MainScreen from '../Screens/Main';
import ConferenceScreen from '../Screens/Conference';

import { RootStackParamList, ScreenNavigationProp } from '../Utils/types';
import { useAuth } from '../Utils/useAuth';


const RootStack = createNativeStackNavigator<RootStackParamList>();

const defaultOptions = {
  headerShown: false,
};

const RootNavigator = () => {
  const navigation = useNavigation<ScreenNavigationProp<'Main'>>();

  const { loginWithToken } = useAuth();

  useEffect(() => {
    const checkUser = async () => {
      const result = await loginWithToken();
      if (result) {
        navigation.navigate('Main', { displayName: result });
      }
    };
    checkUser();
  }, []);

  return (
    <RootStack.Navigator initialRouteName='Login'>
      <RootStack.Screen
        name={"Login"}
        component={LoginScreen}
        options={defaultOptions}
      />
      <RootStack.Screen
        name={"Main"}
        component={MainScreen}
        options={{
          header: () => null,
          gestureEnabled: false,
        }}
      />
      <RootStack.Screen
        name={"Conference"}
        component={ConferenceScreen}
        options={defaultOptions}
      />
      {/* loader */}
    </RootStack.Navigator>
    );
};

export default RootNavigator;