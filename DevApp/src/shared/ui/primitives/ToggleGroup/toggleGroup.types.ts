import type { IconName } from '../Icon'

export type ToggleGroupOption<T extends string> = {
  label: string
  value: T
  icon?: IconName
}
