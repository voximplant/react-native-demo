/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import React, { useLayoutEffect, useState } from 'react';
import { View, Switch, Text } from 'react-native';

import CustomInput from '../../Components/CustomInput';
import CustomButton from '../../Components/CustomButton';
import Header from './header';

import { IScreenProps } from '../../Utils/types';

import styles from './styles';

const MainScreen = ({ navigation }: IScreenProps<'Main'>) => {
  const [conference, setConference] = useState('');
  const [isSendVideo, setSendVideo] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <Header />
    })
  }, []);

  return (
    <View style={styles.container}>
      <CustomInput
        title={"Conference name"}
        value={conference}
        placeholder={'.....'}
        setValue={setConference}
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
