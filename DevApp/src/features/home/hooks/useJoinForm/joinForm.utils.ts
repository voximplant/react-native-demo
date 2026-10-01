import { waitForHydration } from '@/utils'
import type { JoinFormStore } from '../../providers'
import type { JoinFormData } from './joinForm.schema'

export const getJoinFormDefaults = async (
  store: JoinFormStore
): Promise<JoinFormData> => {
  await waitForHydration(store)

  const state = store.getState()

  return {
    mode: state.mode,
    callDestination: state.callDestination,
    conferenceDestination: state.conferenceDestination,
    sendVideo: state.sendVideo,
    receiveVideo: state.receiveVideo,
    muteAudio: state.muteAudio
  }
}
