import { useThemeTokens } from '@/providers/theme'
import { useEffect, useRef, useState } from 'react'
import { Animated, StyleSheet, View } from 'react-native'

type Props = { visible: boolean }

export const ProgressBar: React.FC<Props> = ({ visible }) => {
  const theme = useThemeTokens()
  const anim = useRef(new Animated.Value(0)).current
  const loopRef = useRef<Animated.CompositeAnimation | null>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    anim.setValue(0)
    if (!visible || !width) {
      loopRef.current?.stop()
      return
    }
    loopRef.current = Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true
      })
    )
    loopRef.current.start()
    return () => {
      loopRef.current?.stop()
      loopRef.current = null
    }
  }, [visible, width])

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width * 0.5, width]
  })

  return (
    <View
      style={styles.track}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      {visible && (
        <Animated.View
          style={[
            styles.bar,
            {
              backgroundColor: theme.colors.accent,
              transform: [{ translateX }]
            }
          ]}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  track: { height: 2, overflow: 'hidden', width: '100%' },
  bar: { height: 2, width: '50%', position: 'absolute', left: 0 }
})
