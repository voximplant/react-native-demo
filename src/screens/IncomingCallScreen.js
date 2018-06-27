/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView
} from 'react-native';
import CallButton from '../components/CallButton';
import CallManager from '../manager/CallManager';
import { VoximplantLegacy, Voximplant } from 'react-native-voximplant';
import COLOR from '../styles/Color';

export default class IncomingCallScreen extends React.Component {

    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;

        const callId = params ? params.callId : null;
        this.isVideoCall = params ? params.isVideo : false;
        this.displayName = params ? params.from : null;
        this.call = CallManager.getInstance().getCallById(callId);

        this.state = {
            displayName: null
        }
    }

    componentDidMount() {
        if (this.call) {
            Object.keys(Voximplant.CallEvents).forEach((eventName) => {
                const callbackName = `_onCall${eventName}`;
                if (typeof this[callbackName] !== 'undefined') {
                    this.call.on(eventName, this[callbackName]);
                }
            });
        }
    }

    componentWillUnmount() {
        if (this.call) {
            Object.keys(Voximplant.CallEvents).forEach((eventName) => {
                const callbackName = `_onCall${eventName}`;
                if (typeof this[callbackName] !== 'undefined') {
                    this.call.off(eventName, this[callbackName]);
                }
            });
            this.call = null;
        }
    }

    answerCall(withVideo) {
        this.props.navigation.navigate('Call', {
            callId: this.call.callId,
            isVideo: withVideo,
            isIncoming: true
        });
    }

    declineCall() {
        this.call.decline();
        CallManager.getInstance().removeCall(this.call);
    }

    _onCallDisconnected = (event) => {
        CallManager.getInstance().removeCall(event.call);
        this.props.navigation.navigate("App");
    };

    _onCallEndpointAdded = (event) => {
        console.log('IncomingCallScreen: _onCallEndpointAdded: callid: ' + this.call.callId + ' endpoint id: ' + event.endpoint.id);
        this.setState({displayName: event.endpoint.displayName});
    };

    render() {
        return (
            <SafeAreaView style={styles.safearea}>
                <Text style={styles.incoming_call}>Incoming call from:</Text>
                <Text style={styles.incoming_call}>{this.state.displayName}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', height: 90 }}>
                    <CallButton icon_name='call' color={COLOR.ACCENT} buttonPressed={() => this.answerCall(false)} />
                    <CallButton icon_name='videocam' color={COLOR.ACCENT} buttonPressed={() => this.answerCall(true)} />
                    <CallButton icon_name='call-end' color={COLOR.RED} buttonPressed={() => this.declineCall()} />
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