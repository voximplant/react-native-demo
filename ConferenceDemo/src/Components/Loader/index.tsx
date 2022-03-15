/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import React from 'react';
import {ActivityIndicator, View} from 'react-native';

import {COLORS} from '../../Utils/constants';

import styles from './styles';

const Loader = () => {
  return (
    <View style={styles.container}>
      <View style={styles.loaderWrapper}>
        <ActivityIndicator
          color={COLORS.PRIMARY}
          size="large"
          style={styles.loader}
        />
      </View>
    </View>
  );
};

export default Loader;
