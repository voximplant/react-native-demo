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

import { VoximplantLegacy, Preview, RemoteView } from 'react-native-voximplant';
import CallButton from '../components/CallButton';
import { Keypad } from '../components/Keypad';
import COLOR_SCHEME from '../styles/ColorScheme';

DeviceEventEmitter.addListener(
    VoximplantLegacy.Events.CallRinging,
    (callRinging) => {
        console.log("CallScreen[" + callRinging.callId + "] CallRinging event");
        // if (uaInstance !== undefined) {
        //     uaInstance.setState({ callState: "Ringing" });
        // }
    }
);

DeviceEventEmitter.addListener(
    VoximplantLegacy.Events.CallConnected,
    (callConnected) => {
        console.log("CallScreen[" + callConnected.callId + "] CallConnected event");
        if (callScreenInstance !== null) {
            callScreenInstance.callState = CALL_STATES.CONNECTED;
        }
        // if (uaInstance !== undefined) {
        //     uaInstance.setState({
        //         status: 'connected',
        //         callState: "Call is in progress"
        //     });
        // }
    }
);

DeviceEventEmitter.addListener(
    VoximplantLegacy.Events.CallFailed,
    (callFailed) => {
        console.log("CallScreen[" + callFailed.callId + "] CallFailed event");
        if (callScreenInstance !== null) {
            callScreenInstance.callState = CALL_STATES.DISCONNECTED;
        }
        // if (uaInstance !== undefined) {
        //     uaInstance.setState({
        //         modalText: 'Call failed. Reason: ' + callFailed.reason,
        //         status: 'idle', isModalOpen: true
        //     });
        // }
    }
);

DeviceEventEmitter.addListener(
    VoximplantLegacy.Events.CallDisconnected,
    (callDisconnected) => {
        console.log("CallScreen[" + callDisconnected.callId + "] CallDisconnected event");
        if (callScreenInstance != null) {
            callScreenInstance.callState = CALL_STATES.DISCONNECTED;
            callScreenInstance.props.navigation.navigate("App");
        }
        // if (uaInstance !== undefined) {
        //     console.log('Call disconnected. Call id = ' + callDisconnected.callId);
        //     uaInstance.callDisconnected(callDisconnected.callId);
        // }
    }
);

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

        console.log("CallScreen: ctr: callid: " + this.callId + ", isVideoCall: " + this.isVideoCall
            + ", isIncoming:  " + this.isIncoming + ", callState: " + this.callState);
    }

    componentDidMount() {
        callScreenInstance = this;
        if (this.isIncoming) {
            console.log("CallScreen[" + this.callId + "] answer call");
            VoximplantLegacy.answerCall(this.callId);
        } else {
            console.log("CallScreen[" + this.callId + "] start call");
            VoximplantLegacy.startCall(this.callId);
        }
        this.callState = CALL_STATES.CONNECTING;
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
        VoximplantLegacy.disconnectCall(this.callId);
    }

    switchKeypad() {
        var isVisible = this.state.isKeypadVisible;
        this.setState({ isKeypadVisible: !isVisible});
    }

    _keypadPressed(value) {
        console.log("CallScreen[" + this.callId + "] sendDTMF: " + value);
        VoximplantLegacy.sendDTMF(this.callId, value);
    }

    render() {
        return (
            <SafeAreaView style={styles.safearea}>
                <StatusBar barStyle={Platform.OS === 'ios' ? COLOR_SCHEME.DARK : COLOR_SCHEME.LIGHT} backgroundColor="#392b5b" />
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
                                <CallButton icon_name='mic' color='#8b61ff' buttonPressed={() => this.muteAudio()} />
                            ) : (
                                    <CallButton icon_name='mic-off' color='#8b61ff' buttonPressed={() => this.muteAudio()} />
                                )}
                            <CallButton icon_name='dialpad' color='#8b61ff' buttonPressed={() => this.switchKeypad()} />
                            {this.state.isSpeakerEnabled ? (
                                <CallButton icon_name='volume-mute' color='#8b61ff' buttonPressed={() => this.switchSpeakerphone()} />
                            ) : (
                                    <CallButton icon_name='volume-up' color='#8b61ff' buttonPressed={() => this.switchSpeakerphone()} />
                                )}
                            {this.state.isVideoSent ? (
                                <CallButton icon_name='videocam-off' color='#8b61ff' buttonPressed={() => this.sendVideo(false)} />
                            ) : (
                                    <CallButton icon_name='video-call' color='#8b61ff' buttonPressed={() => this.sendVideo(true)} />
                                )}
                            <CallButton icon_name='call-end' color='#f54b5e' buttonPressed={() => this.endCall()} />

                        </View>
                    </View>

                    <Modal
                        animationType='fade'
                        transparent={true}
                        visible={this.state.isModalOpen}
                        onRequestClose={() => { }}>
                        <TouchableHighlight
                            onPress={(e) => this.setState({ isModalOpen: false, modalText: '' })}
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
        backgroundColor: '#fff',
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
        backgroundColor: '#fff'
    },
});