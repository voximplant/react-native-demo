import type {
  LocalTileData,
  RemoteTileData,
  TileData,
  TileId
} from '@/shared/ui'
import {
  attachLifecycle,
  logger,
  propagateAbort,
  type StoreWithLifecycle
} from '@/utils'
import { runOptimisticSync } from '@/utils/optimistic'
import {
  ConferenceState,
  EndpointEvent,
  type AnyEndpointEvent,
  type Conference,
  type ConferenceId,
  type Endpoint,
  type EndpointId,
  type LocalVideoStream
} from '@voximplant/react-native-calls'
import type {
  ListenerOptions,
  WatchOptions
} from '@voximplant/react-native-shared'
import type { WritableDraft } from 'immer'
import { createStore, type StoreApi } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import {
  CONFERENCE_MAX_REMOTE_TILES,
  CONFERENCE_MAX_TILES
} from '../../conference.constants'
import { endpointToTile } from '../../mappers'
import {
  buildInitialTiles,
  diffEndpoints,
  getVisibleRemoteEndpoints
} from './conference.store.utils'

type State = {
  conferenceId: ConferenceId
  state: ConferenceState
  isMuted: boolean
  isSendingVideo: boolean
  tiles: Record<TileId, TileData>
}

type Actions = {
  mute: (value: boolean) => void
  startSendingVideo: (stream: LocalVideoStream) => Promise<void>
  stopSendingVideo: () => Promise<void>
  hangup: () => void
}

export type ConferenceStoreState = State & Actions
export type ConferenceStore = StoreApi<ConferenceStoreState>

type Reducer = (s: WritableDraft<ConferenceStoreState>) => void

const reducers = {
  setMuted: (isMuted: boolean) => (s) => {
    s.isMuted = isMuted
    const tile = s.tiles.local
    if (tile?.isLocal) tile.isMuted = isMuted
  },

  setSendingVideo: (streams: readonly LocalVideoStream[]) => (s) => {
    s.isSendingVideo = streams.length > 0
    const tile = s.tiles.local
    if (tile?.isLocal) tile.videoStreamId = streams[0]?.id ?? null
  },

  patchLocal: (patch: Partial<LocalTileData>) => (s) => {
    const tile = s.tiles.local
    if (tile?.isLocal) Object.assign(tile, patch)
  },

  patchRemote: (id: EndpointId, patch: Partial<RemoteTileData>) => (s) => {
    const tile = s.tiles[id]
    if (tile && !tile.isLocal) Object.assign(tile, patch)
  },

  addRemoteTile: (endpoint: Endpoint) => (s) => {
    if (s.tiles[endpoint.id]) return
    if (Object.keys(s.tiles).length >= CONFERENCE_MAX_TILES) return

    const local = s.tiles.local
    s.tiles[endpoint.id] = endpointToTile(endpoint)
    if (local) {
      delete s.tiles.local
      s.tiles.local = local
    }
  },

  removeRemoteTile: (id: EndpointId) => (s) => {
    delete s.tiles[id]
  }
} satisfies Record<string, (...args: never[]) => Reducer>

export const createConferenceStore = (
  conference: Conference
): StoreWithLifecycle<ConferenceStore> => {
  const ac = new AbortController()
  const subscribeOptions = {
    signal: ac.signal
  } satisfies WatchOptions<unknown>

  const endpointAbortControllers = new Map<EndpointId, AbortController>()

  const store = createStore<ConferenceStoreState>()(
    immer((set) => {
      const visibleEndpoints = getVisibleRemoteEndpoints(
        conference.endpoints.value,
        CONFERENCE_MAX_REMOTE_TILES
      )

      const subscribeToEndpoint = (endpoint: Endpoint): void => {
        if (ac.signal.aborted) return

        const endpointAc = new AbortController()
        const endpointSubscribeOptions = {
          signal: endpointAc.signal
        } satisfies WatchOptions<unknown> & ListenerOptions<AnyEndpointEvent>

        endpointAbortControllers.set(endpoint.id, endpointAc)

        endpointAc.signal.addEventListener(
          'abort',
          () => {
            endpointAbortControllers.delete(endpoint.id)
          },
          {
            once: true
          }
        )

        propagateAbort(ac.signal, endpointAc)

        endpoint.addEventListener(
          EndpointEvent.StartReceivingVideoStream,
          (event) => {
            if (event.payload.endpointId !== endpoint.id) return
            set(reducers.patchRemote(endpoint.id, { isReceivingVideo: true }))
          },
          endpointSubscribeOptions
        )
        endpoint.addEventListener(
          EndpointEvent.StopReceivingVideoStream,
          (event) => {
            if (event.payload.endpointId !== endpoint.id) return
            set(reducers.patchRemote(endpoint.id, { isReceivingVideo: false }))
          },
          endpointSubscribeOptions
        )

        endpoint.isMuted.watch(
          (isMuted) => set(reducers.patchRemote(endpoint.id, { isMuted })),
          endpointSubscribeOptions
        )

        endpoint.isVoiceActivityDetected.watch(
          (isVad) => set(reducers.patchRemote(endpoint.id, { isVad })),
          endpointSubscribeOptions
        )

        endpoint.videoStreams.watch(
          (streams) =>
            set(
              reducers.patchRemote(endpoint.id, {
                videoStreamId: streams[0]?.id ?? null
              })
            ),
          endpointSubscribeOptions
        )
      }

      const addEndpoint = (endpoint: Endpoint): void => {
        if (endpointAbortControllers.has(endpoint.id)) return

        subscribeToEndpoint(endpoint)
        set(reducers.addRemoteTile(endpoint))
      }

      const removeEndpoint = (id: EndpointId): void => {
        endpointAbortControllers.get(id)?.abort()
        set(reducers.removeRemoteTile(id))
      }

      for (const e of visibleEndpoints) subscribeToEndpoint(e)

      conference.state.watch((state) => set({ state }), subscribeOptions)
      conference.isMuted.watch(
        (v) => set(reducers.setMuted(v)),
        subscribeOptions
      )
      conference.localVideoStreams.watch(
        (v) => set(reducers.setSendingVideo(v)),
        subscribeOptions
      )
      conference.isVoiceActivityDetected.watch(
        (isVad) => set(reducers.patchLocal({ isVad })),
        subscribeOptions
      )
      conference.endpoints.watch((endpoints) => {
        const visible = getVisibleRemoteEndpoints(
          endpoints,
          CONFERENCE_MAX_REMOTE_TILES
        )
        const { added, removed } = diffEndpoints(
          endpointAbortControllers.keys(),
          visible
        )

        removed.forEach(removeEndpoint)
        added.forEach(addEndpoint)
      }, subscribeOptions)

      return {
        conferenceId: conference.id,
        state: conference.state.value,
        isMuted: conference.isMuted.value,
        isSendingVideo: conference.localVideoStreams.value.length > 0,
        tiles: buildInitialTiles(conference, visibleEndpoints),

        mute: (value) => {
          if (conference.isMuted.value === value) return

          try {
            runOptimisticSync(
              () => set(reducers.setMuted(value)),
              () => conference.mute(value),
              () => set(reducers.setMuted(conference.isMuted.value))
            )
          } catch (err) {
            logger.error('CONFERENCE', 'mute failed', { err })
          }
        },
        hangup: () => {
          conference.hangup()
        },
        startSendingVideo: async (stream) => {
          if (conference.localVideoStreams.value.length > 0) return
          await conference.startSendingVideo(stream)
        },
        stopSendingVideo: async () => {
          if (conference.localVideoStreams.value.length === 0) return
          await conference.stopSendingVideo()
        }
      }
    })
  )

  return attachLifecycle(store, {
    destroy: () => ac.abort()
  })
}
