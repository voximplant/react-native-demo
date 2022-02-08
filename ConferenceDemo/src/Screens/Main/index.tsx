import React, { useLayoutEffect, useState } from 'react';
import { View, Switch, Text } from 'react-native';

import CustomInput from '../../Components/CustomInput';
import CustomButton from '../../Components/CustomButton';
import Header from './header';

import { IScreenProps } from '../../Utils/types';

import styles from './styles';

const MainScreen = ({ navigation, route }: IScreenProps<'Main'>) => {
  const [room, setRoom] = useState('');
  const [isSendVideo, setSendVideo] = useState(false);

  const displayName = route.params?.displayName;

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <Header displayName={displayName} navigation={navigation} />
    })
  }, []);

  return (
    <View style={styles.container}>
      <CustomInput
        title={"Conference name"}
        value={room}
        placeholder={'.....'}
        setValue={setRoom}
      />
      <View style={styles.settingsWrapper}>
        <Text style={styles.settingsText}>Send local video:</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#54FF00" }}
          onValueChange={setSendVideo}
          value={isSendVideo}
        />
      </View>
      <CustomButton
        title={'Start conference'}
        onPress={() => {}}
      />
    </View>
  );
};

export default MainScreen;
