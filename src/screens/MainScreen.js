/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
    Text,
    View,
    Modal,
    TouchableHighlight,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    StatusBar
} from 'react-native';

import CallButton from '../components/CallButton';
import LoginManager from '../manager/LoginManager';
import CallManager from '../manager/CallManager';

import {VoximplantLegacy, Voximplant} from 'react-native-voximplant';
import COLOR from '../styles/Color';
import COLOR_SCHEME from '../styles/ColorScheme';
import styles from '../styles/Styles';

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
    };

    _goToLogin = () => {
        LoginManager.getInstance().logout();
        this.props.navigation.navigate("Login");
    };

    makeCall(isVideoCall) {
        console.log('MainScreen: make call: ' + this.number + ', isVideo:' + isVideoCall);
        (async() => {
            let callSettings = {};
            callSettings.video = {};
            callSettings.video.receiveVideo = isVideoCall;
            callSettings.video.sendVideo = isVideoCall;
            let call = await Voximplant.getInstance().call(this.number, callSettings);
            CallManager.getInstance().addCall(call);
            this.props.navigation.navigate('Call', {
                callId: call.callId,
                isVideo: isVideoCall,
                isIncoming: false
            });
        })();
    }

    render() {
        return (
            <SafeAreaView style={styles.safearea}>
                <StatusBar barStyle={COLOR_SCHEME.LIGHT} backgroundColor={COLOR.PRIMARY_DARK} />
                <View style={styles.useragent}>
                    <TextInput
                        underlineColorAndroid='transparent'
                        style={[styles.forminput, styles.margin]}
                        onChangeText={(text) => { this.number = text }}
                        placeholder="Call to"
                        defaultValue={this.number}
                        onSubmitEditing={(e) => this.onSubmit(e)}
                        ref={component => this._thisNumber = component}
                        autoCapitalize='none'
                        autoCorrect={false} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', height: 90 }}>
                        <CallButton icon_name='call' color={COLOR.ACCENT} buttonPressed={() => this.makeCall(false)} />
                        <CallButton icon_name='videocam' color={COLOR.ACCENT} buttonPressed={() => this.makeCall(true)} />
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