export type StoreLifecycle = {
  destroy: () => void
}

export type StoreWithLifecycle<S> = S & StoreLifecycle

export function attachLifecycle<S extends object>(
  store: S,
  lifecycle: StoreLifecycle
): StoreWithLifecycle<S> {
  return Object.assign(store, lifecycle)
}
