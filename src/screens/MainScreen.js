/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Button,
    Modal,
    TouchableHighlight,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    StatusBar
} from 'react-native';

import CallButton from '../components/CallButton';
import LoginManager from '../manager/LoginManager';

import {VoximplantLegacy} from 'react-native-voximplant';

export default class MainScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            headerLeft: (
                <TouchableOpacity onPress={params.backClicked}>
                    <Text style={styles.headerButton}>
                        Logout
                    </Text>
                </TouchableOpacity>
            ),
            headerRight: (
                <TouchableOpacity onPress={params.settingsClick}>
                    <Text style={styles.headerButton}>
                        Settings
                    </Text>
                </TouchableOpacity>
            ),
        };
    };
    constructor(props) {
        super(props);
        this.number = '';
        this.state = {
            isModalOpen: false,
            modalText: ''
        }
    }

    componentWillMount() {
        this.props.navigation.setParams({ settingsClick: this._goToSettings, backClicked: this._goToLogin });
    }

    _goToSettings = () => {
        this.props.navigation.navigate('Settings')
    }

    _goToLogin = () => {
        LoginManager.getInstance().logout();
        this.props.navigation.navigate("Login");
    }

    makeCall(isVideoCall) {
        console.log('MainScreen: make call: ' + this.number + ', isVideo:' + isVideoCall);
        VoximplantLegacy.createCall(this.number, isVideoCall, null, function (newCallId) {
            this.props.navigation.navigate('Call', {
                callId: newCallId,
                isVideo: isVideoCall,
                isIncoming: false
            });
        }.bind(this));
    }

    render() {
        return (
            <SafeAreaView style={styles.safearea}>
                <StatusBar barStyle="light-content" backgroundColor="#392b5b" />
                <View style={styles.useragent}>
                    <TextInput
                        style={[styles.forminput, styles.numberinput]}
                        onChangeText={(text) => { this.number = text }}
                        placeholder="Call to"
                        defaultValue={this.number}
                        onSubmitEditing={(e) => this.onSubmit(e)}
                        ref={component => this._thisNumber = component}
                        autoCapitalize='none'
                        autoCorrect={false} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', height: 90 }}>
                        <CallButton icon_name='call' color='#8b61ff' buttonPressed={() => this.makeCall(false)} />
                        <CallButton icon_name='videocam' color='#8b61ff' buttonPressed={() => this.makeCall(true)} />
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
    safearea: {
        flex: 1,
        backgroundColor: '#fff'
    },
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
    forminput: {
        padding: 5,
        marginBottom: 10,
        height: 40,
        color: '#8b61ff',
        ...Platform.select({
            ios: {
                height: 40,
                borderColor: '#8b61ff',
                borderWidth: 1,
                borderRadius: 4,
            }
        })
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
    headerButton: {
        color: '#FFF',
        fontSize: 16,
        alignSelf: 'center',
        paddingTop: 20,
        textAlign: 'center'
    }
});