import {
  IncomingCallSettings,
  useIncomingCall,
  useIncomingCallActions,
  useIncomingCallForm,
  useIncomingCallScreenLifecycle
} from '@/features/incomingCall'
import { useThemeTokens } from '@/providers/theme'
import { IconButton, Text } from '@/shared/ui'
import { COLORS, SPACING } from '@/styles/theme'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export const IncomingCallScreen = () => {
  useIncomingCallScreenLifecycle()
  const insets = useSafeAreaInsets()
  const theme = useThemeTokens()

  const callId = useIncomingCall((s) => s.callId)
  const displayName = useIncomingCall((s) => s.displayName)
  const withVideo = useIncomingCall((s) => s.withVideo)
  const { answer, decline } = useIncomingCallActions()
  const { control, handleSubmit } = useIncomingCallForm({ callId })

  const onAnswer: () => void = handleSubmit(({ muteAudio, receiveVideo }) => {
    answer({ muteAudio, receiveVideo })
  })

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.textCenter} variant='display'>
          Incoming call
        </Text>

        <Text style={styles.textCenter} variant='body'>
          {withVideo ? 'Video' : 'Audio'}
        </Text>
      </View>

      <View style={styles.body}>
        {displayName ? (
          <Text style={styles.textCenter} variant='heading_1'>
            {displayName}
          </Text>
        ) : null}

        <IncomingCallSettings control={control} />
      </View>

      <View style={styles.actions}>
        <IconButton
          name='phone-off'
          variant='filled'
          color={theme.colors.error}
          size={32}
          onPress={decline}
        />

        <IconButton
          name='phone'
          variant='filled'
          color={COLORS.green500}
          size={32}
          onPress={onAnswer}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: SPACING.content
  },
  header: {
    marginBottom: SPACING.l,
    gap: SPACING.s
  },
  actions: {
    marginTop: SPACING.m,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.s
  },
  answerButton: {
    backgroundColor: COLORS.green500
  },
  answerButtonLabel: {
    color: COLORS.white
  },
  textCenter: {
    textAlign: 'center'
  }
})
