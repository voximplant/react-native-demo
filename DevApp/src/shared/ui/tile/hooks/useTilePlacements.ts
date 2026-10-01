import { useMemo } from 'react'
import type { TileId } from '../Tile'
import type { TileGridRow } from '../TileGrid/tileGrid.types'

export type TilePlacement = {
  top: number
  left: number
  width: number
  height: number
}

const sumRowFlex = (rows: readonly TileGridRow[]): number =>
  rows.reduce((sum, r) => sum + r.flex, 0)

const getRowHeightPct = (row: TileGridRow, totalRowFlex: number): number =>
  (row.flex / totalRowFlex) * 100

const getTileWidthPct = (row: TileGridRow): number => 100 / row.cols

type TileLayout = {
  rowTopOffsetPct: number
  rowHeightPct: number
  colWidthPct: number
}

const getTilePlacement = (
  tileIdx: number,
  layout: TileLayout
): TilePlacement => ({
  top: layout.rowTopOffsetPct,
  left: tileIdx * layout.colWidthPct,
  width: layout.colWidthPct,
  height: layout.rowHeightPct
})

export const useTilePlacements = (
  ids: readonly TileId[],
  rows: readonly TileGridRow[]
): Map<TileId, TilePlacement> =>
  useMemo(() => {
    const placements = new Map<TileId, TilePlacement>()
    const totalRowFlex = sumRowFlex(rows)
    if (totalRowFlex === 0) return placements

    let rowTopOffsetPct = 0 // % from grid top where the next row starts.
    let rowStartIdx = 0 // index in `ids` of the next row's first tile.

    for (const row of rows) {
      const rowHeightPct = getRowHeightPct(row, totalRowFlex)
      const colWidthPct = getTileWidthPct(row)
      const rowIds = ids.slice(rowStartIdx, rowStartIdx + row.cols)

      rowIds.forEach((id, tileIdx) => {
        placements.set(
          id,
          getTilePlacement(tileIdx, {
            rowTopOffsetPct,
            rowHeightPct,
            colWidthPct
          })
        )
      })

      rowTopOffsetPct += rowHeightPct
      rowStartIdx += row.cols
    }

    return placements
  }, [ids, rows])
