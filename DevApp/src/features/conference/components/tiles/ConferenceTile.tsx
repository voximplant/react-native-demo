import { Tile, type TileId } from '@/shared/ui'
import { memo } from 'react'
import { StyleSheet } from 'react-native'
import { useConference } from '../../providers'

type Props = {
  id: TileId
}

export const ConferenceTile: React.FC<Props> = memo(({ id }) => {
  const tile = useConference((s) => s.tiles[id])
  if (!tile) return null

  return <Tile data={tile} style={styles.tile} />
})

const styles = StyleSheet.create({
  tile: { flex: 1 }
})
