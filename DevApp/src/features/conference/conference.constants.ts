import type { TileGridRow } from '@/shared/ui'

export const CONFERENCE_TILE_GRID_ROWS: Record<number, readonly TileGridRow[]> = {
  1: [{ cols: 1, flex: 0.5 }],
  2: [
    { cols: 1, flex: 1 },
    { cols: 1, flex: 1 }
  ],
  3: [
    { cols: 1, flex: 1 },
    { cols: 2, flex: 0.5 }
  ],
  4: [
    { cols: 1, flex: 1 },
    { cols: 1, flex: 1 },
    { cols: 2, flex: 0.5 }
  ],
  5: [
    { cols: 2, flex: 1 },
    { cols: 2, flex: 1 },
    { cols: 1, flex: 1 }
  ],
  6: [
    { cols: 2, flex: 0.5 },
    { cols: 2, flex: 0.5 },
    { cols: 2, flex: 0.5 }
  ]
}

export const CONFERENCE_MAX_TILES = Object.keys(CONFERENCE_TILE_GRID_ROWS).length
export const CONFERENCE_MAX_REMOTE_TILES = CONFERENCE_MAX_TILES - 1
