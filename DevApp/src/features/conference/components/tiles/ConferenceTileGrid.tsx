import { TileGrid, type TileId } from '@/shared/ui'
import { memo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { CONFERENCE_TILE_GRID_ROWS } from '../../conference.constants'
import { useConference } from '../../providers'
import { ConferenceTile } from './ConferenceTile'

export const ConferenceTileGrid: React.FC = memo(() => {
  const tileIds = useConference(useShallow((s) => Object.keys(s.tiles)))
  const rows = CONFERENCE_TILE_GRID_ROWS[tileIds.length] ?? []

  return (
    <TileGrid
      ids={tileIds}
      rows={rows}
      renderTile={(id: TileId) => <ConferenceTile id={id} />}
    />
  )
})
