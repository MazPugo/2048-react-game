import type { Board, Direction, GameState, Tile } from '../types';

const SIZE = 4;
let nextId = 1;

const makeId = (): number => nextId++;

export const resetIdCounter = (): void => {
  nextId = 1;
};

export const emptyBoard = (): Board =>
  Array.from({ length: SIZE }, () => Array(SIZE).fill(null));

const randomValue = (): number => (Math.random() < 0.9 ? 2 : 4);

export const addRandomTile = (board: Board): Board => {
  const empty: [number, number][] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (!board[r][c]) empty.push([r, c]);
    }
  }
  if (empty.length === 0) return board;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const next = board.map((row) => [...row]);
  next[r][c] = { id: makeId(), value: randomValue(), row: r, col: c };
  return next;
};

export const initBoard = (): Board => {
  let board = emptyBoard();
  board = addRandomTile(board);
  board = addRandomTile(board);
  return board;
};

const slideRow = (row: (Tile | null)[]): { row: (Tile | null)[]; score: number } => {
  const tiles = row.filter((t): t is Tile => t !== null);
  const merged: (Tile | null)[] = [];
  let score = 0;
  let i = 0;
  while (i < tiles.length) {
    if (i + 1 < tiles.length && tiles[i].value === tiles[i + 1].value) {
      const value = tiles[i].value * 2;
      score += value;
      merged.push({ id: makeId(), value, row: 0, col: merged.length, mergedFrom: [tiles[i], tiles[i + 1]] });
      i += 2;
    } else {
      merged.push({ ...tiles[i], col: merged.length });
      i++;
    }
  }
  while (merged.length < SIZE) merged.push(null);
  return { row: merged, score };
};

const transpose = (board: Board): Board =>
  Array.from({ length: SIZE }, (_, r) =>
    Array.from({ length: SIZE }, (_, c) => {
      const tile = board[c][r];
      return tile ? { ...tile, row: r, col: c } : null;
    })
  );

const flipH = (board: Board): Board =>
  board.map((row, r) =>
    [...row].reverse().map((tile, c) => (tile ? { ...tile, row: r, col: c } : null))
  );

export const move = (board: Board, direction: Direction): { board: Board; score: number; moved: boolean } => {
  let working = board;
  let totalScore = 0;
  let moved = false;

  if (direction === 'up' || direction === 'down') working = transpose(working);
  if (direction === 'right' || direction === 'down') working = flipH(working);

  const slid = working.map((row, r) => {
    const before = JSON.stringify(row.map((t) => t?.value ?? null));
    const { row: next, score } = slideRow(row);
    totalScore += score;
    if (JSON.stringify(next.map((t) => t?.value ?? null)) !== before) moved = true;
    return next.map((tile, c) => (tile ? { ...tile, row: r, col: c } : null));
  });

  let result = slid;
  if (direction === 'right' || direction === 'down') result = flipH(result);
  if (direction === 'up' || direction === 'down') result = transpose(result);

  const final = result.map((row, r) =>
    row.map((tile, c) => (tile ? { ...tile, row: r, col: c } : null))
  );

  return { board: final, score: totalScore, moved };
};

export const hasWon = (board: Board): boolean =>
  board.some((row) => row.some((t) => t?.value === 2048));

export const isGameOver = (board: Board): boolean => {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (!board[r][c]) return false;
      const val = board[r][c]!.value;
      if (c + 1 < SIZE && board[r][c + 1]?.value === val) return false;
      if (r + 1 < SIZE && board[r + 1][c]?.value === val) return false;
    }
  }
  return true;
};

export const initGameState = (bestScore = 0): GameState => ({
  board: initBoard(),
  score: 0,
  bestScore,
  won: false,
  over: false,
  keepPlaying: false,
});
