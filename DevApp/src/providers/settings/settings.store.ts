import type { AudioDeviceManagerService } from '@/services/sdk'
import {
  attachLifecycle,
  type PersistedStoreApi,
  type StoreWithLifecycle
} from '@/utils'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  AudioDeviceType,
  type AudioDevice
} from '@voximplant/react-native-core'
import type { WatchOptions } from '@voximplant/react-native-shared'
import { createStore } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

type State = {
  audioDeviceType: AudioDeviceType
  selectedAudioDevice: AudioDevice | null
  audioDevices: AudioDevice[]
}

type PersistedState = Pick<State, 'audioDeviceType'>

export const DEFAULT_PERSISTED_SETTINGS: PersistedState = {
  audioDeviceType: AudioDeviceType.Earpiece
}

type Actions = {
  setAudioDeviceType: (value: AudioDeviceType) => void
  selectAudioDevice: (device: AudioDevice) => void
}

export type SettingsStoreState = State & Actions
export type SettingsStore = PersistedStoreApi<
  SettingsStoreState,
  PersistedState
>

type CreateSettingsStoreParams = {
  audioDeviceManager: AudioDeviceManagerService
}

export const createSettingsStore = ({
  audioDeviceManager
}: CreateSettingsStoreParams): StoreWithLifecycle<SettingsStore> => {
  const ac = new AbortController()
  const subscribeOptions = { signal: ac.signal } satisfies WatchOptions<unknown>

  const store = createStore<SettingsStoreState>()(
    persist(
      immer((set) => {
        audioDeviceManager.devices.watch(
          (audioDevices) =>
            set((s) => {
              s.audioDevices = audioDevices
            }),
          subscribeOptions
        )

        audioDeviceManager.selectedDevice.watch(
          (selectedAudioDevice) =>
            set((s) => {
              s.selectedAudioDevice = selectedAudioDevice
            }),
          subscribeOptions
        )

        return {
          audioDeviceType: DEFAULT_PERSISTED_SETTINGS.audioDeviceType,
          selectedAudioDevice: audioDeviceManager.selectedDevice.value,
          audioDevices: audioDeviceManager.devices.value,

          setAudioDeviceType: (audioDeviceType) => {
            audioDeviceManager.setDefaultDeviceType(audioDeviceType)
            set((s) => {
              s.audioDeviceType = audioDeviceType
            })
          },

          selectAudioDevice: (device) => {
            audioDeviceManager.selectDevice(device)
          }
        }
      }),
      {
        name: 'settings',
        storage: createJSONStorage<PersistedState>(() => AsyncStorage),
        partialize: (state) => ({ audioDeviceType: state.audioDeviceType }),
        onRehydrateStorage: () => (state, error) => {
          if (error || !state) return

          audioDeviceManager.setDefaultDeviceType(state.audioDeviceType)
        }
      }
    )
  )

  return attachLifecycle(store, {
    destroy: () => ac.abort()
  })
}
