export type AuthStackParamList = {
  Login: undefined
}

export type MainStackParamList = {
  Home: undefined
  Settings: undefined
  Call: {
    callId: string
  }
  IncomingCall: {
    callId: string
    withVideo: boolean
  }
  Conference: {
    conferenceId: string
  }
}

export type SettingsStackParamList = {
  SettingsScreen: undefined
  AudioDeviceTypeSelect: undefined
  AudioDeviceSelect: undefined
}
