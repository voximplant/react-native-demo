/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import VIForegroundService from '@voximplant/react-native-foreground-service';

class ForegroundService {
  static instance = null;

  constructor() {
    this.service = VIForegroundService.getInstance();
  }

  static getInstance () {
    if (this.instance === null) {
      this.instance = new ForegroundService();
    }
    return this.instance;
  }

  async createNotificationChannel() {
    const channelConfig = {
      id: 'ForegroundServiceChannel',
      name: 'In progress calls',
      description: 'Notify the call is in progress',
      enableVibration: false,
    };
    await this.service.createNotificationChannel(channelConfig);
  }

  async startService() {
    const notificationConfig = {
        channelId: 'ForegroundServiceChannel',
        id: 3456,
        title: 'Voximplant',
        text: 'Call in progress',
        icon: 'ic_vox_notification',
    };
    await this.service.startService(notificationConfig);
  }

  async stopService() {
    await this.service.stopService();
  }
}
export default ForegroundService;
