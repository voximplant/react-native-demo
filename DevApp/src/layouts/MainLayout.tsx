import { GlobalLoading } from '@/shared/components'
import { Content } from '@/shared/ui'
import type { PropsWithChildren } from 'react'
import { StyleSheet, View } from 'react-native'

export const MainLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <View style={styles.container}>
      <GlobalLoading />

      <Content edges={['left', 'right']}>{children}</Content>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
