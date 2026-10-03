import type { Tile as TileType } from '../types';

const TILE_COLORS: Record<number, { bg: string; fg: string }> = {
  2:    { bg: '#eee4da', fg: '#776e65' },
  4:    { bg: '#ede0c8', fg: '#776e65' },
  8:    { bg: '#f2b179', fg: '#f9f6f2' },
  16:   { bg: '#f59563', fg: '#f9f6f2' },
  32:   { bg: '#f67c5f', fg: '#f9f6f2' },
  64:   { bg: '#f65e3b', fg: '#f9f6f2' },
  128:  { bg: '#edcf72', fg: '#f9f6f2' },
  256:  { bg: '#edcc61', fg: '#f9f6f2' },
  512:  { bg: '#edc850', fg: '#f9f6f2' },
  1024: { bg: '#edc53f', fg: '#f9f6f2' },
  2048: { bg: '#edc22e', fg: '#f9f6f2' },
};

const getFontSize = (value: number): string => {
  if (value >= 1024) return '1.4rem';
  if (value >= 128) return '1.8rem';
  return '2rem';
};

interface TileProps {
  /** The tile data to render */
  tile: TileType;
}

const Tile = ({ tile }: TileProps) => {
  const colors = TILE_COLORS[tile.value] ?? { bg: '#3c3a32', fg: '#f9f6f2' };
  return (
    <div
      className={`tile tile-${tile.value}`}
      style={{
        gridRow: tile.row + 1,
        gridColumn: tile.col + 1,
        backgroundColor: colors.bg,
        color: colors.fg,
        fontSize: getFontSize(tile.value),
      }}
    >
      {tile.value}
    </div>
  );
};

export default Tile;
