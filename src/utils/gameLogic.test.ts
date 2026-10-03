import {
  emptyBoard,
  addRandomTile,
  initBoard,
  move,
  hasWon,
  isGameOver,
  resetIdCounter,
} from './gameLogic';
import { Board, Tile } from '../types';

const makeTile = (value: number, row = 0, col = 0): Tile => ({
  id: 999,
  value,
  row,
  col,
});

const boardFromValues = (values: (number | null)[][]): Board =>
  values.map((row, r) =>
    row.map((v, c) => (v ? makeTile(v, r, c) : null))
  );

beforeEach(() => {
  resetIdCounter();
});

describe('emptyBoard', () => {
  it('returns a 4x4 grid of nulls', () => {
    const b = emptyBoard();
    expect(b).toHaveLength(4);
    b.forEach((row) => {
      expect(row).toHaveLength(4);
      row.forEach((cell) => expect(cell).toBeNull());
    });
  });
});

describe('addRandomTile', () => {
  it('adds exactly one tile to empty board', () => {
    const b = addRandomTile(emptyBoard());
    const count = b.flat().filter(Boolean).length;
    expect(count).toBe(1);
  });

  it('tile value is 2 or 4', () => {
    const b = addRandomTile(emptyBoard());
    const tile = b.flat().find(Boolean)!;
    expect([2, 4]).toContain(tile.value);
  });

  it('does not modify a full board', () => {
    const full = boardFromValues([
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2, 4],
      [8, 16, 32, 64],
    ]);
    const result = addRandomTile(full);
    expect(result.flat().filter(Boolean).length).toBe(16);
  });
});

describe('initBoard', () => {
  it('starts with exactly 2 tiles', () => {
    const b = initBoard();
    expect(b.flat().filter(Boolean).length).toBe(2);
  });
});

describe('move', () => {
  it('slides tiles left', () => {
    const b = boardFromValues([
      [null, 2, null, 2],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]);
    const { board, score, moved } = move(b, 'left');
    expect(board[0][0]?.value).toBe(4);
    expect(board[0][1]).toBeNull();
    expect(score).toBe(4);
    expect(moved).toBe(true);
  });

  it('slides tiles right', () => {
    const b = boardFromValues([
      [2, null, 2, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]);
    const { board, score } = move(b, 'right');
    expect(board[0][3]?.value).toBe(4);
    expect(score).toBe(4);
  });

  it('slides tiles up', () => {
    const b = boardFromValues([
      [null, null, null, null],
      [2, null, null, null],
      [null, null, null, null],
      [2, null, null, null],
    ]);
    const { board, score } = move(b, 'up');
    expect(board[0][0]?.value).toBe(4);
    expect(score).toBe(4);
  });

  it('slides tiles down', () => {
    const b = boardFromValues([
      [2, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [2, null, null, null],
    ]);
    const { board, score } = move(b, 'down');
    expect(board[3][0]?.value).toBe(4);
    expect(score).toBe(4);
  });

  it('does not merge a tile twice in one move', () => {
    const b = boardFromValues([
      [2, 2, 2, 2],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]);
    const { board, score } = move(b, 'left');
    expect(board[0][0]?.value).toBe(4);
    expect(board[0][1]?.value).toBe(4);
    expect(board[0][2]).toBeNull();
    expect(score).toBe(8);
  });

  it('reports moved=false when nothing changes', () => {
    const b = boardFromValues([
      [2, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]);
    const { moved } = move(b, 'left');
    expect(moved).toBe(false);
  });
});

describe('hasWon', () => {
  it('returns true when a 2048 tile exists', () => {
    const b = boardFromValues([
      [2048, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]);
    expect(hasWon(b)).toBe(true);
  });

  it('returns false when no 2048 tile', () => {
    expect(hasWon(initBoard())).toBe(false);
  });
});

describe('isGameOver', () => {
  it('returns false when empty cells exist', () => {
    expect(isGameOver(initBoard())).toBe(false);
  });

  it('returns false when merges are possible', () => {
    const b = boardFromValues([
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2, 4],
      [8, 16, 32, 32],
    ]);
    expect(isGameOver(b)).toBe(false);
  });

  it('returns true when no moves remain', () => {
    const b = boardFromValues([
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2048, 4],
      [8, 16, 32, 64],
    ]);
    expect(isGameOver(b)).toBe(true);
  });
});
