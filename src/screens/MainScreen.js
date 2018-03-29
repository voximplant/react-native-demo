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
    TextInput
} from 'react-native';

import CallButton from '../components/CallButton';

export default class MainScreen extends React.Component {
    static navigationOptions = {
        //title: "Voximplant",
        headerStyle: {
            backgroundColor: '#1c0b43',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        }
    };

    constructor(props) {
        super(props);
        this.number = '';
        this.state = {
            isModalOpen: false,
            modalText: ''
        }
    }

    render() {
        return (
            <View style={styles.useragent}>
                {/* <View style={styles.toolbar}>
                    <TouchableOpacity onPress={() => this.logoutClicked()}>
                        <Text style={styles.toolbarButton}>
                            Logout
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.toolbarText}>Logged in as {this.props.uaDisplayName}</Text>
                    <TouchableOpacity>
                        <Text style={styles.toolbarButton}>
                            Settings
                        </Text>
                    </TouchableOpacity>
                </View> */}

                <TextInput
                    style={[styles.forminput, styles.numberinput]}
                    onChangeText={(e) => this.updateNumber(e)}
                    placeholder="Number to call"
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
        );
    }
}

var styles = StyleSheet.create({
    container: {
      flex: 1,    
      justifyContent: 'center',
      alignItems: 'stretch'    
    }, 
    // toolbar: {
    //   backgroundColor: '#0C90E7', 
    //   paddingTop: 30,
    //   paddingBottom: 10,
    //   flexDirection:'row'  
    // },
    // toolbarText: {
    //   color: '#FFFFFF', 
    //   textAlign:'center',
    //   fontWeight: 'bold',
    //   flex: 1
    // },
    // toolbarButton: {
    //   width: 60, 
    //   textAlign:'center',
    //   color: '#FFFFFF',
    // },
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
          borderWidth: 0.5,
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
  });