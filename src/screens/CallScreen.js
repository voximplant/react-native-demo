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
    Image,
    SafeAreaView,
    StatusBar,
    ToastAndroid,
    FlatList
} from 'react-native';

import {
    VoximplantLegacy,
    Preview,
    RemoteView,
    CallEvents,
    Endpoint,
    EndpointEvents,
    VideoStream,
    VideoView,
    RenderScaleType,
    AudioDevice,
    AudioDeviceManager,
    AudioDeviceEvents
} from 'react-native-voximplant';
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
            isKeypadVisible: false,
            isModalOpen: false,
            modalText: '',
            localVideoStreamId: null,
            remoteVideoStreamId: null,
            audioDeviceSelectionVisible: false,
            audioDevices: [],
            audioDeviceIcon: 'hearing'
        }


        this._onCallFailedCallback = (event) => this._onCallFailed(event);
        this._onCallDisconnectedCallback = (event) => this._onCallDisconnected(event);
        this._onCallConnectedCallback = (event) => this._onCallConnected(event);
        this._onLocalVideoStreamAddedCallback = (event) => this._onLocalVideoStreamAdded(event);
        this._onLocalVideoStreamRemovedCallback = (event) => this._onLocalVideoStreamRemoved(event);
        this._onEndpointAddedCallback = (event) => this._onEndpointAdded(event);
        this._onRemoteVideoStreamAddedCallback = (event) => this._onRemoteVideoStreamAdded(event);
        this._onRemoteVideoStreamRemovedCallback = (event) => this._onRemoteVideoStreamRemoved(event);
        this._onEndpointRemovedCallback = (event) => this._onEndpointRemoved(event);
        this._onEndpointInfoUpdatedCallback = (event) => this._onEndpointInfoUpdated(event);
        this._onAudioDeviceChangedCallback = (event) => this._onAudioDeviceChanged(event);
        this._onAudioDeviceListChangedCallBack = (event) => this._onAudioDeviceListChanged(event);

        this.call = CallManager.getInstance().getCallById(this.callId);

        console.log("CallScreen: ctr: callid: " + this.callId + ", isVideoCall: " + this.isVideoCall
            + ", isIncoming:  " + this.isIncoming + ", callState: " + this.callState);
    }

    componentDidMount() {
        callScreenInstance = this;

        if (this.call) {
            this.call.on(CallEvents.Failed, this._onCallFailedCallback);
            this.call.on(CallEvents.Disconnected, this._onCallDisconnectedCallback);
            this.call.on(CallEvents.Connected, this._onCallConnectedCallback);
            this.call.on(CallEvents.LocalVideoStreamAdded, this._onLocalVideoStreamAddedCallback);
            this.call.on(CallEvents.LocalVideoStreamRemoved, this._onLocalVideoStreamRemovedCallback);
            this.call.on(CallEvents.EndpointAdded, this._onEndpointAddedCallback);
            if (this.isIncoming) {
                this.call.getEndpoints().forEach(endpoint => {
                    this._setupEndpointListeners(endpoint, true);
                });
            }
        }
        AudioDeviceManager.getInstance().on(AudioDeviceEvents.DeviceChanged, this._onAudioDeviceChangedCallback);
        AudioDeviceManager.getInstance().on(AudioDeviceEvents.DeviceListChanged, this._onAudioDeviceListChangedCallBack);

        if (this.isIncoming) {
            const callSettings = {
                video: {
                    sendVideo: this.isVideoCall,
                    receiveVideo: this.isVideoCall
                }
            }
            this.call.answer(callSettings);
        }
        this.callState = CALL_STATES.CONNECTING;
    }

    componentWillUnmount() {
        console.log('CallScreen: componentWillUnmount ' + this.call.callId);
        if (this.call) {
            this.call.off(CallEvents.Failed, this._onCallFailedCallback);
            this.call.off(CallEvents.Disconnected, this._onCallDisconnectedCallback);
            this.call.off(CallEvents.Connected, this._onCallConnectedCallback);
            this.call.off(CallEvents.LocalVideoStreamAdded, this._onLocalVideoStreamAddedCallback);
            this.call.off(CallEvents.LocalVideoStreamRemoved, this._onLocalVideoStreamRemovedCallback);
            this.call.off(CallEvents.EndpointAdded, this._onEndpointAddedCallback);
        }
        AudioDeviceManager.getInstance().off(AudioDeviceEvents.DeviceChanged, this._onAudioDeviceChangedCallback);
        AudioDeviceManager.getInstance().off(AudioDeviceEvents.DeviceListChanged, this._onAudioDeviceListChangedCallBack);
    }

    muteAudio() {
        console.log("CallScreen[" + this.callId + "] muteAudio: " + !this.state.isAudioMuted);
        const isMuted = this.state.isAudioMuted;
        this.call.sendAudio(isMuted);
        this.setState({ isAudioMuted: !isMuted });
    }

    sendVideo(doSend) {
        console.log("CallScreen[" + this.callId + "] sendVideo: " + doSend);
        (async () => {
            try {
                await this.call.sendVideo(doSend);
                this.setState({ isVideoSent: doSend });
            } catch (e) {
                console.warn(`Failed to sendVideo(${doSend}) due to ${e.code} ${e.message}`);
            }
        })();
    }

    hold(doHold) {
        console.log('CallScreen[' + this.callId + '] hold: ' + doHold);
        (async () => {
            try {
                await this.call.hold(doHold);
            } catch (e) {
                console.warn('Failed to hold(' + doHold + ') due to ' + e.code + ' ' + e.message);
            }
        })();
    }

    receiveVideo() {
        console.log('CallScreen[' + this.callId + '] receiveVideo');
        (async () => {
            try {
                await this.call.receiveVideo();
            } catch (e) {
                console.warn('Failed to receiveVideo due to ' + e.code + ' ' + e.message);
            }
        })();
    }

    endCall() {
        console.log("CallScreen[" + this.callId + "] endCall");
        this.call.hangup();
    }

    switchKeypad() {
        let isVisible = this.state.isKeypadVisible;
        this.setState({ isKeypadVisible: !isVisible });
    }

    switchAudioDevice() {
        console.log('CallScreen[' + this.callId + '] switchAudioDevice');
        (async() => {
            let devices = await AudioDeviceManager.getInstance().getAudioDevices();
            this.setState({audioDevices: devices, audioDeviceSelectionVisible: true });
        })();
    }

    selectAudioDevice(device) {
        console.log('CallScrene[' + this.callId + '] selectAudioDevice: ' + device); 
        AudioDeviceManager.getInstance().selectAudioDevice(device);
        this.setState({audioDeviceSelectionVisible: false});
    }

    _keypadPressed(value) {
        console.log("CallScreen[" + this.callId + "] _keypadPressed(: " + value);
        this.call.sendTone(value);
    }

    _closeModal() {
        this.setState({ isModalOpen: false, modalText: '' });
        this.props.navigation.navigate("App");
    }

    _onCallFailed(event) {
        this.callState = CALL_STATES.DISCONNECTED;
        CallManager.getInstance().removeCall(this.call);
        this.setState({
            isModalOpen: true,
            modalText: 'Call failed: ' + event.reason
        });
    }

    _onCallDisconnected(event) {
        console.log('CallScreen:' + this.call.callId + '_onCallDisconnected: ' + event.call.callId);
        CallManager.getInstance().removeCall(this.call);
        this.callState = CALL_STATES.DISCONNECTED;
        this.props.navigation.navigate("App");
    }

    _onCallConnected(event) {
        console.log('CallScreen: _onCallConnected: ' + this.call.callId);
        // this.call.sendMessage('Test message');
        // this.call.sendInfo('rn/info', 'test info');
        this.callState = CALL_STATES.DISCONNECTED;
    }

    _onLocalVideoStreamAdded(event) {
        console.log('CallScreen: _onLocalVideoStreamAdded: ' + this.call.callId + ', video stream id: ' + event.videoStream.id);
        this.setState({ localVideoStreamId: event.videoStream.id });
    }

    _onLocalVideoStreamRemoved(event) {
        console.log('CallScreen: _onLocalVideoStreamRemoved: ' + this.call.callId);
        this.setState({ localVideoStreamId: null });
    }

    _onEndpointAdded(event) {
        console.log('CallScreen: _onEndpointAdded: callid: ' + this.call.callId + ' endpoint id: ' + event.endpoint.id);
        this._setupEndpointListeners(event.endpoint, true);
    }

    _onRemoteVideoStreamAdded(event) {
        console.log('CallScreen: _onRemoteVideoStreamAdded: callid: ' + this.call.callId + ' endpoint id: ' + event.endpoint.id);
        this.setState({ remoteVideoStreamId: event.videoStream.id });
    }

    _onRemoteVideoStreamRemoved(event) {
        console.log('CallScreen: _onRemoteVideoStreamRemoved: callid: ' + this.call.callId + ' endpoint id: ' + event.endpoint.id);
        this.setState({ remoteVideoStreamId: null });
    }

    _onEndpointRemoved(event) {
        console.log('CallScreen: _onEndpointRemoved: callid: ' + this.call.callId + ' endpoint id: ' + event.endpoint.id);
        this._setupEndpointListeners(event.endpoint, false);
    }

    _onEndpointInfoUpdated(event) {
        console.log('CallScreen: _onEndpointInfoUpdated: callid: ' + this.call.callId + ' endpoint id: ' + event.endpoint.id);
    }

    _setupEndpointListeners(endpoint, on) {
        if (on) {
            endpoint.on(EndpointEvents.RemoteVideoStreamAdded, this._onRemoteVideoStreamAddedCallback);
            endpoint.on(EndpointEvents.RemoteVideoStreamRemoved, this._onRemoteVideoStreamRemovedCallback);
            endpoint.on(EndpointEvents.Removed, this._onEndpointRemovedCallback);
            endpoint.on(EndpointEvents.InfoUpdated, this._onEndpointInfoUpdatedCallback);
        } else {
            endpoint.off(EndpointEvents.RemoteVideoStreamAdded, this._onRemoteVideoStreamAddedCallback);
            endpoint.off(EndpointEvents.RemoteVideoStreamRemoved, this._onRemoteVideoStreamRemovedCallback);
            endpoint.off(EndpointEvents.Removed, this._onEndpointRemovedCallback);
            endpoint.off(EndpointEvents.InfoUpdated, this._onEndpointInfoUpdatedCallback);
        }
    }

    _onAudioDeviceChanged(event) {
        console.log('CallScreen: _onAudioDeviceChanged:' + event.currentDevice );
        switch (event.currentDevice) {
            case AudioDevice.BLUETOOTH:
                this.setState({audioDeviceIcon: 'bluetooth-audio'});
                break;
            case AudioDevice.SPEAKER:
                this.setState({audioDeviceIcon: 'volume-up'});
                break;
            case AudioDevice.WIRED_HEADSET:
                this.setState({audioDeviceIcon: 'headset'});
                break;
            case AudioDevice.EARPIECE:
            default:
                this.setState({audioDeviceIcon: 'hearing'});
                break;
        }
    }

    _onAudioDeviceListChanged(event) {
        (async() => {
            let device = await AudioDeviceManager.getInstance().getActiveDevice();
            console.log(device);
        })();
        this.setState({audioDevices: event.newDeviceList});
    }

    flatListItemSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "#607D8B",
                }}
            />
        );
    };

    render() {
        return (
            <SafeAreaView style={styles.safearea}>
                <StatusBar barStyle={Platform.OS === 'ios' ? COLOR_SCHEME.DARK : COLOR_SCHEME.LIGHT} backgroundColor={COLOR.PRIMARY_DARK} />
                <View style={styles.useragent}>
                    <View style={styles.videoPanel}>
                        {this.state.isVideoSent ? (
                            <VideoView style={styles.selfview} videoStreamId={this.state.localVideoStreamId} scaleType={RenderScaleType.SCALE_FIT}/>
                        ) : (
                                null
                            )}
                        <VideoView style={styles.remotevideo} videoStreamId={this.state.remoteVideoStreamId} scaleType={RenderScaleType.SCALE_FIT}/>
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
                            <CallButton icon_name={this.state.audioDeviceIcon} color={COLOR.ACCENT} buttonPressed={() => this.switchAudioDevice()} />
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
                        visible={this.state.audioDeviceSelectionVisible}
                        onRequestClose={() => { }}>
                        <TouchableHighlight
                            onPress={(e) => {this.setState({audioDeviceSelectionVisible: false})}}
                            style={styles.container}>
                            <View style={[styles.container, styles.modalBackground]}>
                                <View style={[styles.innerContainer, styles.innerContainerTransparent]}>
                                    <FlatList
                                        data={this.state.audioDevices}
                                        keyExtractor={(item, index) => item}
                                        ItemSeparatorComponent={this.flatListItemSeparator}
                                        renderItem={({ item }) => <Text onPress={() => {this.selectAudioDevice(item)}} > {item} </Text>}
                                    />
                                </View>
                            </View>
                        </TouchableHighlight>
                    </Modal>


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