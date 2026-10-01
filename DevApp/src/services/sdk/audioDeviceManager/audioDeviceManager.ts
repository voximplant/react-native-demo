import {
  AudioDeviceManager,
  AudioDeviceType,
  type AudioDevice
} from '@voximplant/react-native-core'
import type { ReadonlyWatchable } from '@voximplant/react-native-shared'

export class AudioDeviceManagerService {
  private readonly manager = AudioDeviceManager.getInstance()

  private static _instance: AudioDeviceManagerService | null = null

  static get instance(): AudioDeviceManagerService {
    if (!this._instance) this._instance = new AudioDeviceManagerService()
    return this._instance
  }

  static init(): AudioDeviceManagerService {
    return this.instance
  }

  get selectedDevice(): ReadonlyWatchable<AudioDevice | null> {
    return this.manager.selectedDevice
  }

  get devices(): ReadonlyWatchable<AudioDevice[]> {
    return this.manager.devices
  }

  public async selectDevice(device: AudioDevice): Promise<void> {
    return this.manager.selectDevice(device)
  }

  public setDefaultDeviceType(type: AudioDeviceType): void {
    this.manager.setDefaultDeviceType(type)
  }
}
