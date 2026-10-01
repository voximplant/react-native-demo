import type { StoreMutatorIdentifier } from 'zustand'
import type { Mutate, StoreApi } from 'zustand/vanilla'

export type PersistedStoreApi<
  State,
  Persisted = unknown,
  Mutators extends [StoreMutatorIdentifier, unknown][] = []
> = Mutate<StoreApi<State>, [['zustand/persist', Persisted], ...Mutators]>

export type AnyPersistedStore = PersistedStoreApi<any, any>
