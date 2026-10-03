import { act, renderHook } from '@testing-library/react';
import { useGame } from './useGame';

describe('useGame', () => {
  it('initialises with score 0', () => {
    const { result } = renderHook(() => useGame());
    expect(result.current.state.score).toBe(0);
  });

  it('initialises with 2 tiles on the board', () => {
    const { result } = renderHook(() => useGame());
    const count = result.current.state.board.flat().filter(Boolean).length;
    expect(count).toBe(2);
  });

  it('newGame resets the score', () => {
    const { result } = renderHook(() => useGame());
    act(() => {
      result.current.newGame();
    });
    expect(result.current.state.score).toBe(0);
  });

  it('newGame produces a board with 2 tiles', () => {
    const { result } = renderHook(() => useGame());
    act(() => {
      result.current.newGame();
    });
    const count = result.current.state.board.flat().filter(Boolean).length;
    expect(count).toBe(2);
  });

  it('handleMove does not throw', () => {
    const { result } = renderHook(() => useGame());
    expect(() => {
      act(() => {
        result.current.handleMove('left');
      });
    }).not.toThrow();
  });
});
