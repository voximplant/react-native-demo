/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from "react";
import {ScrollView} from "react-native";
import {SafeAreaView, StatusBar} from "react-native";
import {SettingsDividerShort, SettingsDividerLong, SettingsEditText, SettingsCategoryHeader, SettingsSwitch, SettingsPicker} from 'react-native-settings-components';

import styles from "../styles/Styles";
import COLOR_SCHEME from "../styles/ColorScheme";
import COLOR from "../styles/Color";
import CallManager from "../manager/CallManager";

export default class SettingsScreen extends React.Component {
    static navigationOptions = {
        title: "Settings"
    };

    constructor() {
        super();
    }


    render() {
        return(
            <SafeAreaView style={styles.safearea}>
                <StatusBar barStyle={COLOR_SCHEME.LIGHT} backgroundColor={COLOR.PRIMARY_DARK} />
                <ScrollView style={{flex: 1}}>
                    <SettingsSwitch
                        title={'Use CallKit'}
                        onSaveValue={(value) => {
                            console.log('use CallKit:', value);
                            CallManager.getInstance().useCallKit = value;
                        }}
                        value={CallManager.getInstance().useCallKit}
                    />

                </ScrollView>

            </SafeAreaView>
        );

    }

}