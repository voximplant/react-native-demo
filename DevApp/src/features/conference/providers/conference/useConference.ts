import { useStrictContext } from '@/providers/utils'
import { useStore } from 'zustand'
import { ConferenceContext } from './ConferenceProvider'
import type { ConferenceStoreState } from '../../store'

export const useConference = <T>(
  selector: (state: ConferenceStoreState) => T
): T => {
  const store = useStrictContext(ConferenceContext, 'useConference')

  return useStore(store, selector)
}
