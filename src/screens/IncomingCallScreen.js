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
    SafeAreaView
} from 'react-native';
import CallButton from '../components/CallButton';
import CallManager from '../manager/CallManager';
import { VoximplantLegacy, Call, CallEvents } from 'react-native-voximplant';
import COLOR from '../styles/Color';

export default class IncomingCallScreen extends React.Component {

    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;

        const callId = params ? params.callId : null;
        this.isVideoCall = params ? params.isVideo : false;
        this.displayName = params ? params.from : null;
        this.call = CallManager.getInstance().getCallById(callId);
        this._onCallDisconnectedCallback = (event) => this._onCallDisconnected(event);
        this._onEnpointAddedCallback = (event) => this._onEnpointAdded(event);

        this.state = {
            displayName: null
        }
    }

    componentDidMount() {
        if (this.call) {
            this.call.on(CallEvents.Disconnected, this._onCallDisconnectedCallback);
            this.call.on(CallEvents.EndpointAdded, this._onEnpointAddedCallback);
        }
    }

    componentWillUnmount() {
        if (this.call) {
            this.call.off(CallEvents.EndpointAdded, this._onEnpointAddedCallback);
            this.call.off(CallEvents.Disconnected, this._onCallDisconnectedCallback);
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

    _onCallDisconnected(event) {
        CallManager.getInstance().removeCall(event.call);
        this.props.navigation.navigate("App");
    }

    _onEnpointAdded(event) {
        console.log('IncomingCallScreen: _onEndpointAdded: callid: ' + this.call.callId + ' endpoint id: ' + event.endpoint.id);
        this.setState({displayName: event.endpoint.displayName});
    }

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