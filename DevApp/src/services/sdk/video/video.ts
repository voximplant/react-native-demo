import {
  LocalVideoStreamManager,
  VideoSource,
  type LocalVideoStream
} from '@voximplant/react-native-calls'

export class VideoService {
  private _streams: Map<string, LocalVideoStream> = new Map()
  private readonly lvsManager: LocalVideoStreamManager =
    LocalVideoStreamManager.getInstance()

  private static _instance: VideoService | null = null

  static get instance(): VideoService {
    if (!this._instance) this._instance = new VideoService()
    return this._instance
  }

  static init(): VideoService {
    return this.instance
  }

  createLocalVideoStream(): string | null {
    const stream = this.lvsManager.createStream(VideoSource.Camera)
    if (stream === null) return null

    this._streams.set(stream.id, stream)
    return stream.id
  }

  removeLocalVideoStream(streamId: string): void {
    this.lvsManager.removeStream(streamId)
    this._streams.delete(streamId)
  }

  getStream(streamId: string): LocalVideoStream | null {
    return this._streams.get(streamId) ?? null
  }
}
