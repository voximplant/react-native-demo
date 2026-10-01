import { useThemeTokens } from '@/providers/theme'
import { Text } from '@/shared/ui'
import { SPACING } from '@/styles/theme'
import { StyleSheet, View } from 'react-native'

type Props = {
  title: string
  children: React.ReactNode
}

export const ListSubsection: React.FC<Props> = ({ title, children }) => {
  const theme = useThemeTokens()

  return (
    <View style={styles.container}>
      <Text
        variant='heading_2'
        style={[styles.title, { color: theme.colors.textSecondary }]}
      >
        {title}
      </Text>
      <View
        style={[
          styles.content,
          {
            borderRadius: theme.shape.borderRadius.m
          }
        ]}
      >
        {children}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.m },
  title: { marginBottom: SPACING.s },
  content: { overflow: 'hidden' }
})
