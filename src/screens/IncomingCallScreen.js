/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    DeviceEventEmitter,
    SafeAreaView
} from 'react-native';
import CallButton from '../components/CallButton';
import CallManager from '../manager/CallManager';
import { VoximplantLegacy } from 'react-native-voximplant';
import COLOR from '../styles/Color';

DeviceEventEmitter.addListener(
    VoximplantLegacy.Events.CallDisconnected,
    (callDisconnected) => {
        console.log("IncomingCallScreen[" + callDisconnected.callId + "] CallDisconnected event");
        if (screenInstance !== null && 
            screenInstance.callId === callDisconnected.callId) {
                //CallManager.getInstance().removeCall(callDisconnected.callId);
                screenInstance.callId = null;
                screenInstance.props.navigation.navigate("App");
            }
    }
);

var screenInstance = null;

export default class IncomingCallScreen extends React.Component {

    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;

        this.callId = params ? params.callId : null;
        this.isVideoCall = params ? params.isVideo : false;
        this.displayName = params ? params.from : null;
    }

    componentDidMount() {
        screenInstance = this;
    }

    answerCall() {
        this.props.navigation.navigate('Call', {
            callId: this.callId,
            isVideo: this.isVideoCall,
            isIncoming: true
        });
        this.callId = null;
    }

    rejectCall() {
        VoximplantLegacy.declineCall(this.callId);
    }

    render() {
        return (
            <SafeAreaView style={styles.safearea}>
                <Text style={styles.incoming_call}>Incoming call from:</Text>
                <Text style={styles.incoming_call}>{this.displayName}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', height: 90 }}>
                    <CallButton icon_name='call' color={COLOR.ACCENT} buttonPressed={() => this.answerCall()} />
                    <CallButton icon_name='call-end' color={COLOR.RED} buttonPressed={() => this.rejectCall()} />
                </View>
            </SafeAreaView>
        );
    }
}

var styles = StyleSheet.create({
    safearea: {
        flex: 1,
        backgroundColor: COLOR.WHITE,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    incoming_call: {
        justifyContent: 'center',
        alignSelf: 'center',
        fontSize: 22,
    },
});