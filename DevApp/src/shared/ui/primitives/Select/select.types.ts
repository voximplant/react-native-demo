export type SelectOption<T> = { label: string; value: T }

export type SelectProps<Value extends string> = {
  value: Value | null
  options: SelectOption<Value>[]
  placeholder?: string
  label?: string
  caption?: string
  error?: string
  onChange: (value: Value) => void
}
