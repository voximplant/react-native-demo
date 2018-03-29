/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React, { Component } from 'react';
import {
    DeviceEventEmitter,
    Dimensions,
    StyleSheet,
    Text,
    View,
    Button,
    TextInput,
    Platform,
    Modal,
    TouchableHighlight,
    TouchableOpacity,
    SafeAreaView,
    StatusBar
} from 'react-native';

import LoginManager from '../manager/LoginManager';
import DefaultPreference from 'react-native-default-preference';
import COLOR_SCHEME from '../styles/ColorScheme';

var _this;

export default class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.password = '';
        this.state = {
            username: '',
            isModalOpen: false,
            modalText: ''
        }
    }

    componentDidMount() {
        _this = this;
        DefaultPreference.get('usernameValue').then(
            function(value) {
              _this.setState({username: value}); 
        });
        LoginManager.getInstance().on('onConnectionFailed', (reason) => this.onConnectionFailed(reason));
        LoginManager.getInstance().on('onLoggedIn', (param) => this.onLoggedIn());
        LoginManager.getInstance().on('onLoginFailed', (errorCode) => this.onLoginFailed(errorCode));
    }

    onLoginFailed(errorCode) {
        switch (errorCode) {
            case 401:
                this.setState({ isModalOpen: true, modalText: 'Invalid password' });
                break;
            case 403:
                this.setState({ isModalOpen: true, modalText: 'Account frozen' });
                break;
            case 404:
                this.setState({ isModalOpen: true, modalText: 'Invalid username' });
                break;
            case 701:
                this.setState({ isModalOpen: true, modalText: 'Token expired' });
                break;
            default:
            case 500:
                this.setState({ isModalOpen: true, modalText: 'Internal error' });
        }
    }

    onLoggedIn() {
        DefaultPreference.set('usernameValue', this.state.username);
        this.props.navigation.navigate('App');
    }

    onConnectionFailed(reason) {
        this.setState({ isModalOpen: true, modalText: 'Failed to connect, check internet settings' });
    }

    loginClicked() {
        LoginManager.getInstance().loginWithPassword(this.state.username + ".voximplant.com", this.password);
    }

    loginWithOneTimeKeyClicked() {
        LoginManager.getInstance().loginWithOneTimeKey(this.state.username + ".voximplant.com", this.password);
    }

    render() {
        return (
            <SafeAreaView style={styles.safearea}>
                <StatusBar barStyle={Platform.OS === 'ios' ? COLOR_SCHEME.DARK : COLOR_SCHEME.LIGHT} backgroundColor="#392b5b" />
                <View style={[styles.container]}>
                    <View>
                        <View style={styles.loginform}>
                            <TextInput
                                style={styles.forminput}
                                placeholder="user@app.account"
                                value={this.state.username}
                                autoFocus={true}
                                ref='acc'
                                autoCapitalize='none'
                                autoCorrect={false}
                                onSubmitEditing={(event) => this.focusNextField('password')}
                                onChangeText={(text) => { this.setState({username: text}) }}
                                blurOnSubmit={true} />
                            <TextInput
                                style={styles.forminput}
                                placeholder="User password"
                                defaultValue={this.password}
                                secureTextEntry={true}
                                ref='password'
                                onChangeText={(text) => { this.password = text }}
                                blurOnSubmit={true} />
                            <TouchableOpacity onPress={() => this.loginClicked()} style={{ width: 220, alignSelf: 'center' }}>
                                <Text style={styles.loginbutton}>
                                    LOGIN
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.loginWithOneTimeKeyClicked()} style={{ width: 220, alignSelf: 'center' }}>
                                <Text style={styles.loginbutton}>
                                    LOGIN WITH ONE TIME KEY
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Modal
                        animationType='fade'
                        transparent={true}
                        visible={this.state.isModalOpen}
                        onRequestClose={() => { }}>
                        <TouchableHighlight
                            onPress={(e) => this.setState({ isModalOpen: false })}
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
    appheader: {
        resizeMode: 'contain',
        height: 60,
        alignSelf: 'center'
    },
    loginform: {
        paddingHorizontal: 20,
        alignItems: 'stretch'
    },
    loginbutton: {
        color: '#662eff',
        fontSize: 16,
        alignSelf: 'center',
        paddingTop: 20,
        textAlign: 'center'
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
    }
});