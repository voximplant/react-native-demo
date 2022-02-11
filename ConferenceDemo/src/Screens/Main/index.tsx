/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import React, { useState } from 'react';
import { View, Switch, Text, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomInput from '../../Components/CustomInput';
import CustomButton from '../../Components/CustomButton';
import MainHeader from '../../Components/MainHeader';

import { IScreenProps } from '../../Utils/types';
import { COLORS } from '../../Utils/constants';

import styles from './styles';

const MainScreen = ({ navigation }: IScreenProps<'Main'>) => {
  const [conference, setConference] = useState('');
  const [isSendVideo, setSendVideo] = useState(false);

  const startConference = async () => {
    // TODO: request permissions
    navigation.navigate('Conference');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle={'light-content'} backgroundColor={COLORS.PRIMARY} />
      <MainHeader />
      <View style={styles.contentWrapper}>
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
          onPress={startConference}
        />
      </View>
    </SafeAreaView>
  );
};

export default MainScreen;
