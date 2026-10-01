import { useThemeTokens } from '@/providers/theme'
import { Text } from '@/shared/ui'
import { SPACING } from '@/styles/theme'
import { StyleSheet, View } from 'react-native'

type Props = {
  title: string
  children: React.ReactNode
}

export const ListSection: React.FC<Props> = ({ title, children }) => {
  const theme = useThemeTokens()

  return (
    <View style={styles.container}>
      <Text
        variant='heading_1'
        style={[
          styles.title,
          {
            color: theme.colors.textSecondary
          }
        ]}
      >
        {title}
      </Text>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.l },
  title: { marginBottom: SPACING.l }
})
