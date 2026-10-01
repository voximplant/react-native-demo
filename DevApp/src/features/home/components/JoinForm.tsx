import { Separator } from '@/shared/ui'
import { SPACING } from '@/styles/theme'
import { type Control } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'
import { JoinInput, JoinSettings } from '../components'
import type { JoinFormData } from '../hooks/useJoinForm'

type Props = {
  control: Control<JoinFormData>
}

export const JoinForm: React.FC<Props> = ({ control }) => (
  <View style={styles.container}>
    <JoinInput control={control} />
    <Separator />
    <JoinSettings control={control} />
  </View>
)

const styles = StyleSheet.create({
  container: { gap: SPACING.m }
})
