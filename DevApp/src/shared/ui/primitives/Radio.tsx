import { useThemeTokens } from '@/providers/theme'
import { StyleSheet, View } from 'react-native'

type Props = {
  selected: boolean
}

export const Radio: React.FC<Props> = ({ selected }) => {
  const theme = useThemeTokens()

  return (
    <View style={[styles.radio, { borderColor: theme.colors.accent }]}>
      {selected && (
        <View style={[styles.dot, { backgroundColor: theme.colors.accent }]} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6
  }
})
