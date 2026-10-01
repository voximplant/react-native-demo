export const runOptimistic = async (
  apply: () => void,
  action: () => void | Promise<void>,
  revert: () => void
): Promise<void> => {
  apply()
  try {
    await action()
  } catch (err) {
    revert()
    throw err
  }
}

export const runOptimisticSync = (
  apply: () => void,
  action: () => void,
  revert: () => void
): void => {
  apply()

  try {
    action()
  } catch (err) {
    revert()
    throw err
  }
}
