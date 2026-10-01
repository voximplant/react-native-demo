import { SwitchField, Text } from '@/shared/ui'
import { SPACING } from '@/styles/theme'
import { Controller, type Control } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'
import type { IncomingCallFormData } from '../hooks/useIncomingCallForm'

type Props = {
  control: Control<IncomingCallFormData>
}

export const IncomingCallSettings: React.FC<Props> = ({ control }) => (
  <View style={styles.container}>
    <Text style={styles.title} variant='heading_2'>
      Settings
    </Text>

    <Controller
      control={control}
      name='muteAudio'
      render={({ field }) => (
        <SwitchField
          label='Mute audio'
          value={field.value}
          onValueChange={field.onChange}
        />
      )}
    />

    <Controller
      control={control}
      name='receiveVideo'
      render={({ field }) => (
        <SwitchField
          label='Receive video'
          value={field.value}
          onValueChange={field.onChange}
        />
      )}
    />
  </View>
)

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: '100%'
  },
  title: {
    marginBottom: SPACING.s,
    textAlign: 'center'
  }
})
