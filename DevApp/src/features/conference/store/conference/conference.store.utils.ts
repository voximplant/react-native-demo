import type {
  Conference,
  Endpoint,
  EndpointId
} from '@voximplant/react-native-calls'
import { endpointToTile, localStreamToTile } from '../../mappers'
import type { ConferenceStoreState } from './conference.store'

export const buildInitialTiles = (
  conference: Conference,
  endpoints: readonly Endpoint[]
): ConferenceStoreState['tiles'] => ({
  ...Object.fromEntries(endpoints.map((e) => [e.id, endpointToTile(e)])),
  local: localStreamToTile(conference.localVideoStreams.value[0]?.id ?? null, {
    isMuted: conference.isMuted.value
  })
})

export const diffEndpoints = (
  currentIds: Iterable<EndpointId>,
  nextEndpoints: readonly Endpoint[]
): { added: Endpoint[]; removed: EndpointId[] } => {
  const currentSet = new Set(currentIds)
  const nextSet = new Set(nextEndpoints.map((e) => e.id))
  return {
    added: nextEndpoints.filter((e) => !currentSet.has(e.id)),
    removed: [...currentSet].filter((id) => !nextSet.has(id))
  }
}

export const getVisibleRemoteEndpoints = <T extends Endpoint>(
  endpoints: readonly T[],
  max: number
): T[] => endpoints.slice(0, max)
