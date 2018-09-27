/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
    Text,
    View,
    TextInput,
    Platform,
    Modal,
    TouchableHighlight,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    AsyncStorage
} from 'react-native';

import LoginManager from '../manager/LoginManager';
import COLOR_SCHEME from '../styles/ColorScheme';
import COLOR from '../styles/Color';
import styles from '../styles/Styles';

let _this;

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
        (async() => {
            const usernameValue = await AsyncStorage.getItem('usernameValue');
            _this.setState({username: usernameValue});
        })();
        LoginManager.getInstance().on('onConnectionFailed', (reason) => this.onConnectionFailed(reason));
        LoginManager.getInstance().on('onLoggedIn', (displayName) => this.onLoggedIn(displayName));
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

    onLoggedIn(displayName) {
        (async() => {
            await AsyncStorage.setItem('usernameValue', this.state.username);
        })();
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
                <StatusBar barStyle={Platform.OS === 'ios' ? COLOR_SCHEME.DARK : COLOR_SCHEME.LIGHT} backgroundColor={COLOR.PRIMARY_DARK} />
                <View style={[styles.container]}>
                    <View>
                        <View style={styles.loginform}>
                            <TextInput
                                underlineColorAndroid='transparent'
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
                                underlineColorAndroid='transparent'
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