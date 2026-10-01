import { useThemeTokens } from '@/providers/theme'
import { StyleSheet, View } from 'react-native'

type ContentEdge = 'top' | 'bottom' | 'left' | 'right'

type Props = {
  children: React.ReactNode
  edges?: ContentEdge[]
}

export const Content: React.FC<Props> = ({
  edges = ['top', 'bottom', 'left', 'right'],
  children
}) => {
  const theme = useThemeTokens()

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: edges.includes('top') ? theme.spacing.content : 0,
          paddingBottom: edges.includes('bottom') ? theme.spacing.content : 0,
          paddingLeft: edges.includes('left') ? theme.spacing.content : 0,
          paddingRight: edges.includes('right') ? theme.spacing.content : 0
        }
      ]}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 }
})
