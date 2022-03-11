/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import React from 'react';
import {View, Text, Modal} from 'react-native';
import {useSelector} from 'react-redux';

import AudioDeviceElement from '../AudioDeviceElement';

import {HardwareService} from '../../Core/Services/HardwareService';
import {RootReducer} from '../../Core/Store';
import {availableDevices} from '../../Utils/constants';

import styles from './styles';

interface IProps {
  modalVisible: boolean;
  setModalVisible: (modalVisible: boolean) => void;
}

const ModalAudioDevices = ({modalVisible, setModalVisible}: IProps) => {
  const {selectedAudioDevice, listAudioDevices} = useSelector(
    (state: RootReducer) => state.conferenceReducer,
  );

  const {selectAudioDevice} = HardwareService();

  const selectNewDevice = async (device: string) => {
    selectAudioDevice(device);
    setModalVisible(!modalVisible);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
      <View style={styles.wrapperContent}>
        <Text style={styles.headerText}>Audio Devices</Text>
        {Object.keys(availableDevices).map(key => {
          const available = listAudioDevices?.indexOf(key) !== -1;
          const isActive = key === selectedAudioDevice?.key;
          const device = availableDevices[key];
          return (
            available && (
              <AudioDeviceElement
                key={device.key}
                Icon={device.Icon}
                isActive={isActive}
                IconActive={device.IconActive}
                text={device.text}
                typeForSelect={key}
                onPress={selectNewDevice}
              />
            )
          );
        })}
      </View>
    </Modal>
  );
};

export default ModalAudioDevices;
