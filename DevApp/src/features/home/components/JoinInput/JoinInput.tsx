import { Input, ToggleGroup } from '@/shared/ui'
import { SPACING } from '@/styles/theme'
import { Controller, type Control } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'
import {
  JOIN_CONFIG,
  JOIN_OPTIONS,
  type JoinFormData
} from '../../hooks/useJoinForm'

type Props = {
  control: Control<JoinFormData>
}

export const JoinInput: React.FC<Props> = ({ control }) => (
  <Controller
    control={control}
    name='mode'
    render={({ field: modeField }) => {
      const name =
        modeField.value === 'call' ? 'callDestination' : 'conferenceDestination'

      return (
        <View style={styles.container}>
          <ToggleGroup
            options={JOIN_OPTIONS}
            value={modeField.value}
            onChange={modeField.onChange}
          />

          <Controller
            key={name}
            name={name}
            control={control}
            render={({ field, fieldState }) => (
              <Input
                value={field.value}
                onChangeText={field.onChange}
                placeholder={JOIN_CONFIG[modeField.value].placeholder}
                error={fieldState.error?.message}
              />
            )}
          />
        </View>
      )
    }}
  />
)

const styles = StyleSheet.create({
  container: { gap: SPACING.s }
})
