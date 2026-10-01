import { USERNAME_SUFFIX } from '@/services/sdk'
import { ConnectionNodeSelect } from '@/shared/components'
import { Button, Input } from '@/shared/ui'
import { SPACING } from '@/styles/theme'
import { Controller } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'
import { useLoginForm } from '../hooks/useLoginForm'

export const LoginForm = () => {
  const { control, login, formState } = useLoginForm()

  return (
    <View style={styles.container}>
      <View style={styles.inputs}>
        <Controller
          control={control}
          name='username'
          render={({ field, fieldState }) => (
            <Input
              label='Username'
              suffix={USERNAME_SUFFIX}
              value={field.value}
              onChangeText={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name='password'
          render={({ field, fieldState }) => (
            <Input
              secureTextEntry
              label='Password'
              value={field.value}
              onChangeText={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name='node'
          render={({ field, fieldState }) => (
            <ConnectionNodeSelect
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />
      </View>

      <View style={styles.buttons}>
        <Button
          size='lg'
          label='Login'
          onPress={() => login('password')}
          processing={formState.isSubmitting}
        />

        <Button
          size='lg'
          label='Login with OTK'
          variant='secondary'
          onPress={() => login('otk')}
          processing={formState.isSubmitting}
        />
      </View>

      <View style={styles.inputs}>
        <Controller
          control={control}
          name='gateway'
          render={({ field, fieldState }) => (
            <Input
              label='Gateway'
              value={field.value}
              onChangeText={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.m
  },
  inputs: {
    gap: SPACING.s
  },
  buttons: { gap: SPACING.s }
})
