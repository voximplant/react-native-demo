// @ts-ignore
import VIForegroundService from '@voximplant/react-native-foreground-service';

export const ForegroudService = () => {
  const createForegroundConfig = async () => {
    try {
      const channelConfig = {
        id: 'conferenceChannel',
        name: 'Conference Demo',
      };
      await VIForegroundService.createNotificationChannel(channelConfig);
    } catch (error) {
      console.warn('method createConfigChannel:[ERROR] ===>', error);
    }
  };

  const startForegroundService = async () => {
    try {
      const notificationConfig = {
        channelId: 'conferenceChannel',
        id: 444,
        title: 'Conference Demo',
        text: 'Conference Demo call in progress...',
        icon: 'ic_launcher',
      };
      await VIForegroundService.startService(notificationConfig);
    } catch (error) {
      console.warn('method startForegroundService:[ERROR] ===>', error);
    }
  };

  const stopForegroudService = async () => {
    try {
      await VIForegroundService.stopService();
    } catch (error) {
      console.warn('method stopForegroudService:[ERROR] ===>', error);
    }
  };

  return {
    createForegroundConfig,
    startForegroundService,
    stopForegroudService,
  };
};
