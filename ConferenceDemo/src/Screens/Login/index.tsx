import React, { createRef, useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';

import CustomButton from '../../Components/CustomButton';
import CustomInput from '../../Components/CustomInput';

import { COLORS } from '../../Utils/constants';
import { IScreenProps } from '../../Utils/types';
import { useAuth } from '../../Utils/useAuth';
import { useUtils } from '../../Utils/useUtils';

import styles from './styles';

const LoginScreen = ({ navigation }: IScreenProps<'Login'>) => {
  const { loginWithPassword } = useAuth();
  const { convertError, showAllert } = useUtils();

  const usernameRef = createRef<TextInput>();
  const passwordRef = createRef<TextInput>();

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    usernameRef.current?.setNativeProps({ borderColor: COLORS.BLUE })
    passwordRef.current?.setNativeProps({ borderColor: COLORS.BLUE })
  }, [usernameRef, passwordRef]);

  const login = async () => {
    try {
      const result = await loginWithPassword(userName, password);
      navigation.navigate('Main', { displayName: result });
    } catch (error) {
      const message = convertError(error, usernameRef, passwordRef);
      if (message) {
        showAllert(message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CustomInput
        refer={usernameRef}
        title={'Login'}
        value={userName}
        isLogin
        setValue={setUserName}
        placeholder={'user@app.account'}
        styleFromProps={{
          input: styles.usernameInput,
        }}
      />
      <CustomInput
        refer={passwordRef}
        title={'Password'}
        value={password}
        isPassword
        placeholder={'password'}
        setValue={setPassword}
      />
      <CustomButton
        title={"Login"}
        onPress={login}
      />
    </View>
  );
};

export default LoginScreen;
