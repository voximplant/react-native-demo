// @ts-ignore
import VIForegroundService from '@voximplant/react-native-foreground-service';
import { useRef } from 'react';

export const ForegroudService = () => {
  const service = useRef(VIForegroundService.getInstance());

  const createForegroundConfig = async () => {
    try {
      const channelConfig = {
        id: 'conferenceChannel',
        name: 'Conference Demo',
      };
      await service.current?.createNotificationChannel(
        channelConfig,
      );
    } catch (error) {
      console.warn('method createForegroundConfig:[ERROR] ===>', error);
    }
  };

  const startForegroundService = async () => {
    try {
      const notificationConfig = {
        channelId: 'conferenceChannel',
        id: 444,
        title: 'Conference Demo',
        text: 'Conference call is in progress...',
        icon: 'ic_vox_notification',
        button: 'Hangup',
      };
      await service.current?.startService(notificationConfig);
    } catch (error) {
      console.warn('method startForegroundService:[ERROR] ===>', error);
    }
  };

  const stopForegroudService = async () => {
    try {
      await service.current?.stopService();
    } catch (error) {
      console.warn('method stopForegroudService:[ERROR] ===>', error);
    }
  };

  const subscribeForegroundServiceEvent = (hangUp: () => void) => {
    service.current?.on('VIForegroundServiceButtonPressed', () => {
      hangUp();
    });
  };

  return {
    createForegroundConfig,
    startForegroundService,
    stopForegroudService,
    subscribeForegroundServiceEvent,
  };
};
