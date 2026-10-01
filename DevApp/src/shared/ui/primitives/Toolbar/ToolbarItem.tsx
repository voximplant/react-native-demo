import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native'

type Props = {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
}

export const ToolbarItem: React.FC<Props> = ({ children, style }) => (
  <View style={[styles.container, style]}>{children}</View>
)

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch'
  }
})
