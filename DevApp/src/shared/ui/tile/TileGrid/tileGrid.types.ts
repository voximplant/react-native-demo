import type { TileData } from '../Tile/tile.types'

export type TileGridRow = { cols: number; flex: number }

export type FilledTileGridRow = { tiles: readonly TileData[]; flex: number }
