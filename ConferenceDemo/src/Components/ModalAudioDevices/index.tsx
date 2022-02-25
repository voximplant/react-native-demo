/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import React, {useEffect, useState} from 'react';
import {View, Text, Modal} from 'react-native';

import AudioDeviceElement from '../AudioDeviceElement';

import {ConferenceService} from '../../Core/Services/ConferenceService';
import {IAvailableDeivces} from '../../Utils/types';

import PhoneIcon from '../../Assets/Icons/mobileIcon.svg';
import PhoneIconActive from '../../Assets/Icons/mobileIconActive.svg';
import SpeakerIcon from '../../Assets/Icons/SpeakerIcon.svg';
import SpeakerIconActive from '../../Assets/Icons/SpeakerIconActive.svg';
import BluetoothIcon from '../../Assets/Icons/bluetoothIcon.svg';
import BluetoothIconActive from '../../Assets/Icons/bluetoothIconActive.svg';
import HeadphonesIcon from '../../Assets/Icons/headphonesIcon.svg';
import HeadphonesIconActive from '../../Assets/Icons/headphonesIconActive.svg';
import styles from './styles';

const availableDevices: IAvailableDeivces = {
  Earpiece: {
    id: 1,
    text: 'Phone',
    Icon: PhoneIcon,
    IconActive: PhoneIconActive,
  },
  Speaker: {
    id: 2,
    text: 'Speaker',
    Icon: SpeakerIcon,
    IconActive: SpeakerIconActive,
  },
  Bluetooth: {
    id: 3,
    text: 'Blutooth Headphones',
    Icon: BluetoothIcon,
    IconActive: BluetoothIconActive,
  },
  WiredHeadset: {
    id: 4,
    text: 'Headphones',
    Icon: HeadphonesIcon,
    IconActive: HeadphonesIconActive,
  },
};

interface IProps {
  modalVisible: boolean;
  setModalVisible: (modalVisible: boolean) => void;
}

const ModalAudioDevices = ({modalVisible, setModalVisible}: IProps) => {
  const {AudioDeviceManager} = ConferenceService();
  const [currentDevice, setCurrentDevice] = useState<string>();
  const [listDevices, setListDevices] = useState<Array<string>>();

  const selectNewDevice = async (device: string) => {
    await AudioDeviceManager.selectAudioDevice(device);
    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    getActiveAudioDevice();
    getListAudioDevices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalVisible]);

  const getListAudioDevices = async () => {
    const list = await AudioDeviceManager.getAudioDevices();
    setListDevices(list);
  };

  const getActiveAudioDevice = async () => {
    const device = await AudioDeviceManager.getActiveDevice();
    setCurrentDevice(device);
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
        {listDevices?.map(el => {
          let available = availableDevices[el];
          const isActive = el === currentDevice;
          return (
            available && (
              <AudioDeviceElement
                key={available.id}
                Icon={available.Icon}
                isActive={isActive}
                IconActive={available.IconActive}
                text={available.text}
                typeForSelect={el}
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
