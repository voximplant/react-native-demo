import { useStrictContext } from '@/providers/utils'
import { useStore } from 'zustand'
import { JoinFormContext } from './JoinFormProvider'
import type { JoinFormStore, JoinFormStoreState } from './joinForm.store'

export const useJoinFormStore = (): JoinFormStore =>
  useStrictContext(JoinFormContext, 'useJoinFormStore')

export const useJoinFormState = <T>(
  selector: (state: JoinFormStoreState) => T
): T => {
  const store = useJoinFormStore()

  return useStore(store, selector)
}
