import type { VideoService } from '@/services/sdk'
import type { LocalVideoStream } from '@voximplant/react-native-calls'
import { createStore, type StoreApi } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type State = {
  localVideoStreamId: string | null
}

type Actions = {
  startLocalVideo: () => string | null
  stopLocalVideo: () => void
  resolveLocalStream: () => LocalVideoStream | null
}

export type MediaStoreState = State & Actions
export type MediaStore = StoreApi<MediaStoreState>

export const createMediaStore = (videoService: VideoService): MediaStore =>
  createStore<MediaStoreState>()(
    immer((set, get) => ({
      localVideoStreamId: null,

      startLocalVideo: () => {
        const streamId = videoService.createLocalVideoStream()
        set((s) => {
          s.localVideoStreamId = streamId
        })
        return streamId
      },

      stopLocalVideo: () => {
        const streamId = get().localVideoStreamId
        if (!streamId) return

        videoService.removeLocalVideoStream(streamId)
        set((s) => {
          s.localVideoStreamId = null
        })
      },

      resolveLocalStream: () => {
        const { localVideoStreamId, startLocalVideo } = get()
        const id = localVideoStreamId ?? startLocalVideo()
        const stream = id ? videoService.getStream(id) : null

        return stream ?? null
      }
    }))
  )
