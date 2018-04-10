/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    Modal,
    TouchableHighlight,
    TouchableOpacity,
    Platform,
    DeviceEventEmitter,
    Image,
    SafeAreaView,
    StatusBar
} from 'react-native';

import { VoximplantLegacy, Preview, RemoteView, CallEvents } from 'react-native-voximplant';
import CallButton from '../components/CallButton';
import { Keypad } from '../components/Keypad';
import COLOR_SCHEME from '../styles/ColorScheme';
import COLOR from '../styles/Color';
import CallManager from '../manager/CallManager';

const CALL_STATES = {
    DISCONNECTED: 'disconnected',
    CONNECTING: 'connecting',
    CONNECTED: 'connected'
}

var callScreenInstance = null;

export default class CallScreen extends React.Component {
    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;

        this.callId = params ? params.callId : null;
        this.isVideoCall = params ? params.isVideo : false;
        this.isIncoming = params ? params.isIncoming : false;
        this.callState = CALL_STATES.DISCONNECTED;
        this.isKeyboardVisible = false;

        this.state = {
            isAudioMuted: false,
            isVideoSent: this.isVideoCall,
            isSpeakerEnabled: false,
            isKeypadVisible: false,
            isModalOpen: false,
            modalText: ''
        }

        
        this._onCallFailedCallback = (event) => this._onCallFailed(event);
        this._onCallDisconnectedCallback = (event) => this._onCallDisconnected(event);
        this._onCallConnectedCallback = (event) => this._onCallConnected(event);

        this.call = CallManager.getInstance().getCallById(this.callId);
        if (this.call !== null) {
            this.call.on(CallEvents.Failed, this._onCallFailedCallback);
            this.call.on(CallEvents.Disconnected, this._onCallDisconnectedCallback);
            this.call.on(CallEvents.Connected, this._onCallConnectedCallback);
        }

        console.log("CallScreen: ctr: callid: " + this.callId + ", isVideoCall: " + this.isVideoCall
            + ", isIncoming:  " + this.isIncoming + ", callState: " + this.callState);
    }

    componentDidMount() {
        callScreenInstance = this;
        // if (this.isIncoming) {
        //     console.log("CallScreen[" + this.callId + "] answer call");
        //     VoximplantLegacy.answerCall(this.callId);
        // } else {
        //     console.log("CallScreen[" + this.callId + "] start call");
        //     VoximplantLegacy.startCall(this.callId);
        // }
        this.callState = CALL_STATES.CONNECTING;
    }

    componentWillUnmount() {
        console.log('CallScreen: componentWillUnmount ' + this.call.callId);
        if (this.call) {
            this.call.off(CallEvents.Failed, this._onCallFailedCallback);
            this.call.off(CallEvents.Disconnected, this._onCallDisconnectedCallback);
            this.call.off(CallEvents.Connected, this._onCallConnectedCallback);
        }
    }

    muteAudio() {
        console.log("CallScreen[" + this.callId + "] muteAudio: " + !this.state.isAudioMuted);
        var isMuted = this.state.isAudioMuted;
        VoximplantLegacy.setMute(!isMuted);
        this.setState({isAudioMuted: !isMuted});
    }

    switchSpeakerphone() {
        console.log("CallScreen[" + this.callId + "] switchSpeakerphone: " + !this.state.isSpeakerEnabled);
        var isSpeaker = this.state.isSpeakerEnabled;
        VoximplantLegacy.setUseLoudspeaker(!isSpeaker);
        this.setState({ isSpeakerEnabled: !isSpeaker});
    }

    sendVideo(doSend) {
        console.log("CallScreen[" + this.callId + "] sendVideo: " + doSend);
        this.setState({ isVideoSent: doSend });
        VoximplantLegacy.sendVideo(doSend);
    }

    endCall() {
        console.log("CallScreen[" + this.callId + "] endCall");
        this.call.hangup();
    }

    switchKeypad() {
        var isVisible = this.state.isKeypadVisible;
        this.setState({ isKeypadVisible: !isVisible});
    }

    _keypadPressed(value) {
        console.log("CallScreen[" + this.callId + "] sendDTMF: " + value);
        VoximplantLegacy.sendDTMF(this.callId, value);
    }

    _closeModal() {
        this.setState({ isModalOpen: false, modalText: '' });
        this.props.navigation.navigate("App");
    }

    _onCallFailed(event) {
        this.callState = CALL_STATES.DISCONNECTED;
        this.setState({
            isModalOpen: true, 
            modalText: 'Call failed: ' + event.reason
        });
    }

    _onCallDisconnected(event) {
        console.log('CallScreen:' + this.call.callId +  '_onCallDisconnected: ' + event.call.callId);
        CallManager.getInstance().removeCall(this.call);
        this.callState = CALL_STATES.DISCONNECTED;
        this.props.navigation.navigate("App");
    }

    _onCallConnected(event) {
        console.log('CallScreen: _onCallConnected: ');
        this.callState = CALL_STATES.DISCONNECTED;
    }

    render() {
        return (
            <SafeAreaView style={styles.safearea}>
                <StatusBar barStyle={Platform.OS === 'ios' ? COLOR_SCHEME.DARK : COLOR_SCHEME.LIGHT} backgroundColor={COLOR.PRIMARY_DARK} />
                <View style={styles.useragent}>
                    <View style={styles.videoPanel}>
                        <RemoteView style={styles.remotevideo} callId={this.callId} ></RemoteView>
                        {this.state.isVideoSent ? (
                            <Preview style={styles.selfview}></Preview>
                        ) : (
                                null
                            )}
                    </View>

                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={styles.call_connecting_label}>{this.state.callState}</Text>
                    </View>

                    {this.state.isKeypadVisible ? (
                        <Keypad keyPressed={(e) => this._keypadPressed(e)} />
                    ) : (
                            null
                        )}

                    <View style={styles.call_controls}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'transparent' }}>
                            {this.state.isAudioMuted ? (
                                <CallButton icon_name='mic' color={COLOR.ACCENT} buttonPressed={() => this.muteAudio()} />
                            ) : (
                                    <CallButton icon_name='mic-off' color={COLOR.ACCENT} buttonPressed={() => this.muteAudio()} />
                                )}
                            <CallButton icon_name='dialpad' color={COLOR.ACCENT} buttonPressed={() => this.switchKeypad()} />
                            {this.state.isSpeakerEnabled ? (
                                <CallButton icon_name='volume-mute' color={COLOR.ACCENT} buttonPressed={() => this.switchSpeakerphone()} />
                            ) : (
                                    <CallButton icon_name='volume-up' color={COLOR.ACCENT} buttonPressed={() => this.switchSpeakerphone()} />
                                )}
                            {this.state.isVideoSent ? (
                                <CallButton icon_name='videocam-off' color={COLOR.ACCENT} buttonPressed={() => this.sendVideo(false)} />
                            ) : (
                                    <CallButton icon_name='video-call' color={COLOR.ACCENT} buttonPressed={() => this.sendVideo(true)} />
                                )}
                            <CallButton icon_name='call-end' color={COLOR.RED} buttonPressed={() => this.endCall()} />

                        </View>
                    </View>

                    <Modal
                        animationType='fade'
                        transparent={true}
                        visible={this.state.isModalOpen}
                        onRequestClose={() => { }}>
                        <TouchableHighlight
                            onPress={(e) => this._closeModal()}
                            style={styles.container}>
                            <View style={[styles.container, styles.modalBackground]}>
                                <View
                                    style={[styles.innerContainer, styles.innerContainerTransparent]}>
                                    <Text>{this.state.modalText}</Text>
                                </View>
                            </View>
                        </TouchableHighlight>
                    </Modal>
                </View>

            </SafeAreaView>
        );
    }

}


var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch'
    },
    modalBackground: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20
    },
    innerContainer: {
        borderRadius: 10,
    },
    innerContainerTransparent: {
        backgroundColor: COLOR.WHITE,
        padding: 20
    },
    useragent: {
        flex: 1,
        flexDirection: 'column',
    },
    selfview: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 100,
        height: 120,
    },
    remotevideo: {
        flex: 1,
        // width: 300,
        // height: 300
    },
    videoPanel: {
        flex: 1,
        position: 'relative'
    },
    call_controls: {
        height: 70,
    },
    numberinput: {
        margin: 10
    },
    call_connecting_label: {
        fontSize: 18,
        alignSelf: 'center'
    },
    safearea: {
        flex: 1,
        backgroundColor: COLOR.WHITE,
    },
});