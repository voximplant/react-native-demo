export type RadioListOptionId = string

export type RadioListOption<T> = {
  id: RadioListOptionId
  label: string
  value: T
}
