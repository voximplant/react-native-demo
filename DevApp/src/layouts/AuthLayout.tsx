import { GlobalLoading } from '@/shared/components'
import type { PropsWithChildren } from 'react'
import { StyleSheet, View } from 'react-native'
import { Content } from '../shared/ui/primitives/Content'

export const AuthLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <View style={styles.container}>
      <GlobalLoading />

      <Content edges={['bottom', 'left', 'right']}>{children}</Content>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 }
})
