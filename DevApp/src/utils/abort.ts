/**
 * Aborts `target` whenever `sourceSignal` aborts.
 *
 * If `target` is aborted first, the propagation listener is removed
 * from `sourceSignal` to avoid leaking.
 */
export const propagateAbort = (
  sourceSignal: AbortSignal,
  target: AbortController
): void => {
  if (sourceSignal.aborted) {
    target.abort()
    return
  }

  const propagate = () => target.abort()

  sourceSignal.addEventListener('abort', propagate, { once: true })

  target.signal.addEventListener(
    'abort',
    () => sourceSignal.removeEventListener('abort', propagate),
    { once: true }
  )
}
