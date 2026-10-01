export type TileId = string

export interface BaseTileData {
  id: TileId
  displayName: string | null
  videoStreamId: string | null
  isVad: boolean
  isMuted: boolean
}

export type LocalTileData = BaseTileData & {
  isLocal: true
}

export type RemoteTileData = BaseTileData & {
  isLocal: false
  isReceivingVideo: boolean
}

export type TileData = LocalTileData | RemoteTileData
