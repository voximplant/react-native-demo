import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import { useAuth } from '../../Utils/useAuth';
import { ScreenNavigationProp } from '../../Utils/types';

import Logout from '../../Assets/Icons/Logout.svg';
import styles from './styles';

interface IProps {
  displayName: string;
  navigation: ScreenNavigationProp<'Main'>
}

const Header = ({ displayName, navigation }: IProps) => {
  const { logOut } = useAuth();

  const logout = async () => {
    await logOut();
    navigation.navigate('Login');
  };

  return (
    <View style={styles.headerWrapper}>
      <View style={styles.emptyView} />
      <Text style={styles.headerTitle}>Logged as {displayName}</Text>
      <TouchableOpacity onPress={logout} style={styles.logoutButton}>
        <Logout style={styles.logoutButtonIcon} />
      </TouchableOpacity>
    </View>
)};

export default Header;
