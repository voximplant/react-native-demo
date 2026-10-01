import { CallConnecting, CallReconnectingBanner } from '@/shared/ui'
import { ConferenceState } from '@voximplant/react-native-calls'
import { StyleSheet, View } from 'react-native'
import { ConferenceControls, ConferenceTileGrid } from '../../components'
import { useConferenceScreenLifecycle } from '../../hooks'
import { useConference } from '../../providers'

const CONNECTING_STATES = [ConferenceState.Created, ConferenceState.Connecting]

export const ConferenceScreen = () => {
  useConferenceScreenLifecycle()
  const state = useConference((s) => s.state)
  const isConnecting = CONNECTING_STATES.includes(state)

  return (
    <>
      {state === ConferenceState.Reconnecting && <CallReconnectingBanner />}

      <View style={styles.container}>
        {isConnecting ? <CallConnecting /> : <ConferenceTileGrid />}
      </View>

      <ConferenceControls />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
