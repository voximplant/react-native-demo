import { useThemeTokens } from '@/providers/theme'
import { ActivityIndicator, SwitchField } from '@/shared/ui'
import { SHAPE } from '@/styles/theme'
import { memo } from 'react'
import { Controller, useWatch, type Control } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'
import {
  JOIN_CONFIG,
  JOIN_SETTINGS_LABELS,
  type JoinFormData
} from '../hooks/useJoinForm'

type Props = {
  control: Control<JoinFormData>
}

export const JoinSettings: React.FC<Props> = memo(({ control }) => {
  const theme = useThemeTokens()
  const mode = useWatch({ control, name: 'mode' })
  const config = JOIN_CONFIG[mode]

  return (
    <View style={[styles.container, { borderColor: theme.colors.border }]}>
      {config ? (
        config.settings.map((name) => (
          <Controller
            key={name}
            control={control}
            name={name}
            render={({ field }) => (
              <SwitchField
                label={JOIN_SETTINGS_LABELS[name]}
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />
        ))
      ) : (
        <ActivityIndicator size='large' />
      )}
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: SHAPE.borderRadius.m
  }
})
