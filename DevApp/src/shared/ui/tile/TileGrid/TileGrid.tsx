import { SPACING } from '@/styles/theme'
import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { useTilePlacements } from '../hooks'
import { type TileId } from '../Tile'
import type { TileGridRow } from './tileGrid.types'

type Props = {
  ids: readonly TileId[]
  rows: readonly TileGridRow[]
  renderTile: (id: TileId) => React.ReactNode
}

const GRID_GAP = SPACING.s

export const TileGrid: React.FC<Props> = memo(({ ids, rows, renderTile }) => {
  const placements = useTilePlacements(ids, rows)

  return (
    <View style={styles.grid}>
      {ids.map((id) => {
        const p = placements.get(id)
        if (!p) return null
        return (
          <View
            key={id}
            style={[
              styles.cell,
              {
                top: `${p.top}%`,
                left: `${p.left}%`,
                width: `${p.width}%`,
                height: `${p.height}%`
              }
            ]}
          >
            {renderTile(id)}
          </View>
        )
      })}
    </View>
  )
})

const styles = StyleSheet.create({
  grid: {
    flex: 1
  },
  cell: {
    position: 'absolute',
    padding: GRID_GAP / 2
  },
  tile: { flex: 1 }
})
