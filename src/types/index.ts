export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Tile {
  id: number;
  value: number;
  row: number;
  col: number;
  mergedFrom?: [Tile, Tile];
}

export type Board = (Tile | null)[][];

export interface GameState {
  board: Board;
  score: number;
  bestScore: number;
  won: boolean;
  over: boolean;
  keepPlaying: boolean;
}

export interface LeaderboardEntry {
  score: number;
  date: string;
}
