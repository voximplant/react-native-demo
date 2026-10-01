import { CallConnecting, CallReconnectingBanner } from '@/shared/ui'
import { SPACING } from '@/styles/theme'
import { CallState } from '@voximplant/react-native-calls'
import { StyleSheet, View } from 'react-native'
import { CallControls, CallLocalVideo, CallRemoteVideo } from '../../components'
import { useCallScreenLifecycle } from '../../hooks'
import { useCall } from '../../providers'

const CALL_CONNECTING_STATES = [CallState.Created, CallState.Connecting]

export const CallScreen = () => {
  useCallScreenLifecycle()
  const state = useCall((s) => s.state)
  const isConnecting = CALL_CONNECTING_STATES.includes(state)

  return (
    <>
      {state === CallState.Reconnecting && <CallReconnectingBanner />}

      <View style={styles.container}>
        <View style={styles.video}>
          {isConnecting ? <CallConnecting /> : <CallRemoteVideo />}
        </View>

        <View style={styles.video}>
          <CallLocalVideo />
        </View>
      </View>

      <CallControls />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: SPACING.m
  },
  video: { flex: 1 }
})
