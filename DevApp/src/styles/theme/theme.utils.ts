import { Platform, processColor, type ProcessedColorValue } from 'react-native'

export type ProcessedThemeColorValue =
  | ProcessedColorValue
  | string
  | null
  | undefined

export const toNativeColor = (color: string): ProcessedThemeColorValue => {
  if (!color) return color

  if (['ios', 'macos'].includes(Platform.OS)) {
    return processColor(color)
  }

  return color
}
