import type { Call } from "@voximplant/react-native-calls"
import type { ExtraHeaders } from "@voximplant/react-native-shared"

export interface OnIncomingCallEvent {
  call: Call
  withVideo: boolean
  headers?: ExtraHeaders
}