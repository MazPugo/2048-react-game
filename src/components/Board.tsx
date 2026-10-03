import type { Board as BoardType } from '../types';
import Tile from './Tile';

interface BoardProps {
  /** The 4x4 game board */
  board: BoardType;
}

const Board = ({ board }: BoardProps) => {
  const tiles = board.flatMap((row) => row).filter((t) => t !== null);

  return (
    <div className="board-container">
      <div className="board-grid">
        {Array.from({ length: 16 }, (_, i) => (
          <div key={i} className="cell" />
        ))}
      </div>
      <div className="tiles-grid">
        {tiles.map((tile) => (
          <Tile key={tile.id} tile={tile} />
        ))}
      </div>
    </div>
  );
};

export default Board;
