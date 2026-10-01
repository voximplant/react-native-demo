import {
  useDerivedValue,
  withTiming,
  type DerivedValue
} from 'react-native-reanimated'

const DEFAULT_DURATION_MS = 160

export type AnimatedValue = number | string

export const useAnimatedValue = <T extends AnimatedValue>(
  value: T,
  duration = DEFAULT_DURATION_MS
): DerivedValue<T> => {
  const animatedValue = useDerivedValue(() => withTiming(value, { duration }))

  return animatedValue
}
