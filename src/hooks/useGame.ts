import { useCallback, useEffect, useState } from 'react';
import type { Direction, GameState } from '../types';
import { addRandomTile, initGameState, isGameOver, hasWon, move } from '../utils/gameLogic';
import { saveToLeaderboard } from '../utils/leaderboard';

const BEST_SCORE_KEY = '2048-best-score';

const loadBest = (): number => {
  try {
    return parseInt(localStorage.getItem(BEST_SCORE_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
};

const saveBest = (score: number): void => {
  try {
    localStorage.setItem(BEST_SCORE_KEY, String(score));
  } catch {
    // storage unavailable
  }
};

export const useGame = () => {
  const [state, setState] = useState<GameState>(() => initGameState(loadBest()));

  const newGame = useCallback(() => {
    setState((prev) => initGameState(prev.bestScore));
  }, []);

  const keepPlaying = useCallback(() => {
    setState((prev) => ({ ...prev, keepPlaying: true }));
  }, []);

  const handleMove = useCallback((direction: Direction) => {
    setState((prev) => {
      if (prev.over || (prev.won && !prev.keepPlaying)) return prev;

      const { board: moved, score, moved: didMove } = move(prev.board, direction);
      if (!didMove) return prev;

      const newBoard = addRandomTile(moved);
      const newScore = prev.score + score;
      const newBest = Math.max(prev.bestScore, newScore);
      saveBest(newBest);

      const gameOver = isGameOver(newBoard);
      if (gameOver) saveToLeaderboard(newScore);

      return {
        ...prev,
        board: newBoard,
        score: newScore,
        bestScore: newBest,
        won: !prev.won && hasWon(newBoard),
        over: gameOver,
      };
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Direction> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
      };
      const dir = map[e.key];
      if (dir) {
        e.preventDefault();
        handleMove(dir);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleMove]);

  return { state, newGame, keepPlaying, handleMove };
};
