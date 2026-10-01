type CapitalizeOptions = {
  lowercaseRest?: boolean
}

export const capitalize = (
  value: string,
  options?: CapitalizeOptions
): string => {
  if (value.length === 0) return value

  const first = value.charAt(0).toUpperCase()
  const rest = options?.lowercaseRest
    ? value.slice(1).toLowerCase()
    : value.slice(1)

  return first + rest
}
