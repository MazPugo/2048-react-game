# How to Customize and Extend the 2048 React Game

> **Goal**: Modify and extend the 2048 game with common customizations and features  
> **Use case**: When you need to adapt the game for different requirements or add new functionality  
> **Time required**: 5-30 minutes per task

## Prerequisites

Before starting, you should:
- Be familiar with React hooks and TypeScript
- Understand the basic 2048 game mechanics
- Have Node.js 18+ and npm installed
- Know how to run `npm run dev`, `npm run test`, and `npm run typecheck`

## Project Context

This guide covers common modifications for the 2048 React game. The game uses a pure functional architecture with game logic separated from UI components, making customizations straightforward.

**Architecture Overview**:
- `src/utils/gameLogic.ts` - Pure game logic functions
- `src/hooks/useGame.ts` - State management and event handling
- `src/components/` - React UI components
- `src/types/index.ts` - TypeScript type definitions

---

## Task 1: Add a New Tile Value

**Problem**: You want tiles to merge beyond 2048 or change the win condition.

### Step 1: Add the tile color definition

Open `/workshop/2048-react-game/src/components/Tile.tsx` and add your new tile value to the `TILE_COLORS` map:

```typescript
const TILE_COLORS: Record<number, { bg: string; fg: string }> = {
  2:    { bg: '#eee4da', fg: '#776e65' },
  // ... existing colors ...
  2048: { bg: '#edc22e', fg: '#f9f6f2' },
  4096: { bg: '#3c3a32', fg: '#f9f6f2' }, // Add new value
  8192: { bg: '#000000', fg: '#f9f6f2' }, // Add another if needed
};
```

**Expected result**: New tiles display with the specified colors.

### Step 2: Update font size scaling (if needed)

If your new values have more digits, adjust the `getFontSize` function:

```typescript
const getFontSize = (value: number): string => {
  if (value >= 8192) return '1.2rem';  // Add for larger numbers
  if (value >= 1024) return '1.4rem';
  if (value >= 128) return '1.8rem';
  return '2rem';
};
```

### Step 3: Change the win condition (optional)

To win at a different value, edit `/workshop/2048-react-game/src/utils/gameLogic.ts`:

```typescript
export const hasWon = (board: Board): boolean =>
  board.some((row) => row.some((t) => t?.value === 4096)); // Change from 2048
```

**Verify it worked**: Run the game and merge tiles to create your new value. Check that colors display correctly.

### Troubleshooting

**Problem**: New tiles show with default colors (dark gray)  
**Cause**: Missing entry in TILE_COLORS map  
**Solution**: Ensure the value key matches exactly what appears in the game (e.g., 4096, not "4096")

**Problem**: Numbers overflow the tile  
**Cause**: Font size too large for the number of digits  
**Solution**: Add a more aggressive font size reduction in `getFontSize()`

---

## Task 2: Add Touch/Swipe Support

**Problem**: The game only works with keyboard arrow keys. You need mobile touch support.

### Step 1: Add touch event state to useGame hook

Edit `/workshop/2048-react-game/src/hooks/useGame.ts` and add touch tracking after the existing state:

```typescript
export const useGame = () => {
  const [state, setState] = useState<GameState>(() => initGameState(loadBest()));
  
  // Add touch tracking
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  
  // ... existing callbacks ...
```

Don't forget to import useRef:

```typescript
import { useCallback, useEffect, useState, useRef } from 'react';
```

### Step 2: Add touch event handlers

Add these handlers before the keyboard useEffect:

```typescript
  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStartRef.current) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const minSwipeDistance = 50;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > minSwipeDistance) {
        e.preventDefault();
        handleMove(deltaX > 0 ? 'right' : 'left');
      }
    } else {
      if (Math.abs(deltaY) > minSwipeDistance) {
        e.preventDefault();
        handleMove(deltaY > 0 ? 'down' : 'up');
      }
    }
    
    touchStartRef.current = null;
  }, [handleMove]);
```

### Step 3: Add touch event listeners

Add a second useEffect after the keyboard listener:

```typescript
  useEffect(() => {
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd]);
```

**Success criteria**: You can swipe on mobile/touchscreen to move tiles.

### Troubleshooting

**Problem**: Page scrolls instead of moving tiles  
**Solution**: Add `touch-action: none` to `.board-wrapper` in `App.css`:

```css
.board-wrapper {
  position: relative;
  touch-action: none; /* Prevent scrolling during swipes */
}
```

**Problem**: Diagonal swipes don't work consistently  
**Cause**: Threshold too high or gesture too short  
**Solution**: Reduce `minSwipeDistance` to 30-40 pixels

---

## Task 3: Customize Board Size

**Problem**: You want a 5x5 or 6x6 board instead of 4x4.

### Step 1: Change the SIZE constant

Edit `/workshop/2048-react-game/src/utils/gameLogic.ts`:

```typescript
const SIZE = 5; // Change from 4 to any size
```

**Warning**: Changing SIZE affects game difficulty significantly. Larger boards are much easier.

### Step 2: Update the CSS grid

Edit `/workshop/2048-react-game/src/App.css`:

```css
.board-grid,
.tiles-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* Change from 4 */
  grid-template-rows: repeat(5, 1fr);    /* Change from 4 */
  gap: 12px;
}
```

### Step 3: Update the cell count in Board component

Edit `/workshop/2048-react-game/src/components/Board.tsx`:

```typescript
<div className="board-grid">
  {Array.from({ length: 25 }, (_, i) => ( // Change from 16 to SIZE*SIZE
    <div key={i} className="cell" />
  ))}
</div>
```

**Better approach**: Make it dynamic:

```typescript
const SIZE = 5; // Add constant at top of file

const Board = ({ board }: BoardProps) => {
  const tiles = board.flatMap((row) => row).filter((t) => t !== null);

  return (
    <div className="board-container">
      <div className="board-grid">
        {Array.from({ length: SIZE * SIZE }, (_, i) => (
          <div key={i} className="cell" />
        ))}
      </div>
      {/* ... rest unchanged */}
    </div>
  );
};
```

**Verify it worked**: Run `npm run typecheck` then `npm run dev`. You should see a 5x5 grid.

### Troubleshooting

**Problem**: Board looks stretched or squashed  
**Solution**: The `aspect-ratio: 1` on `.cell` keeps cells square. If board container is constrained, adjust `.app` max-width in CSS

**Problem**: Tests fail after changing SIZE  
**Solution**: Update test fixtures in `gameLogic.test.ts` to match the new board size

### Alternative Approach: Make SIZE configurable

Export SIZE as a constant and import it where needed:

```typescript
// In gameLogic.ts
export const BOARD_SIZE = 4;
const SIZE = BOARD_SIZE;
```

Then import in components and CSS-in-JS solutions. For pure CSS, you'll need to use CSS custom properties set via inline styles.

---

## Task 4: Add Undo Feature

**Problem**: Players want to undo their last move.

### Step 1: Add history tracking to GameState type

Edit `/workshop/2048-react-game/src/types/index.ts`:

```typescript
export interface GameState {
  board: Board;
  score: number;
  bestScore: number;
  won: boolean;
  over: boolean;
  keepPlaying: boolean;
  history?: GameState[]; // Add history array
}
```

### Step 2: Track history in useGame hook

Edit `/workshop/2048-react-game/src/hooks/useGame.ts`. Modify the `handleMove` function:

```typescript
const handleMove = useCallback((direction: Direction) => {
  setState((prev) => {
    if (prev.over || (prev.won && !prev.keepPlaying)) return prev;

    const { board: moved, score, moved: didMove } = move(prev.board, direction);
    if (!didMove) return prev;

    // Save current state to history before making the move
    const history = prev.history || [];
    const historyEntry = { ...prev, history: undefined }; // Don't nest history
    const newHistory = [...history.slice(-9), historyEntry]; // Keep last 10 states

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
      history: newHistory, // Add history to state
    };
  });
}, []);
```

### Step 3: Add undo function

Add this callback in the useGame hook:

```typescript
const undo = useCallback(() => {
  setState((prev) => {
    if (!prev.history || prev.history.length === 0) return prev;
    const newHistory = [...prev.history];
    const previousState = newHistory.pop()!;
    return { ...previousState, history: newHistory };
  });
}, []);
```

Export it from the hook:

```typescript
return { state, newGame, keepPlaying, handleMove, undo };
```

### Step 4: Add keyboard shortcut for undo

In the keyboard useEffect, add the undo key:

```typescript
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
  } else if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    undo();
  }
};
```

### Step 5: Add undo button to UI

Edit `/workshop/2048-react-game/src/App.tsx`:

```typescript
const App = () => {
  const { state, newGame, keepPlaying, undo } = useGame();
  
  const canUndo = state.history && state.history.length > 0;

  return (
    <div className="app">
      <Header score={state.score} bestScore={state.bestScore} onNewGame={newGame} />
      
      <div style={{ marginBottom: '12px' }}>
        <button 
          className="new-game-btn" 
          onClick={undo}
          disabled={!canUndo}
        >
          Undo (Ctrl+Z)
        </button>
      </div>
      {/* ... rest unchanged */}
```

**Success criteria**: Pressing Ctrl+Z or clicking Undo reverts the last move.

### Best Practices

- Limit history to 10 entries to prevent memory issues
- Disable undo on game over or after winning (if desired)
- Don't include history in history entries (prevents exponential memory growth)
- Consider clearing history on "New Game"

---

## Task 5: Persist Full Game State

**Problem**: Game state is lost on page refresh. You want to save and restore the entire game.

### Step 1: Add localStorage save function

Edit `/workshop/2048-react-game/src/hooks/useGame.ts`:

```typescript
const GAME_STATE_KEY = '2048-game-state';

const saveGameState = (state: GameState): void => {
  try {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
  } catch {
    // storage unavailable
  }
};

const loadGameState = (): GameState | null => {
  try {
    const raw = localStorage.getItem(GAME_STATE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GameState;
  } catch {
    return null;
  }
};
```

### Step 2: Load state on mount

Modify the useState initialization:

```typescript
const [state, setState] = useState<GameState>(() => {
  const saved = loadGameState();
  if (saved && !saved.over) {
    return { ...saved, bestScore: Math.max(saved.bestScore, loadBest()) };
  }
  return initGameState(loadBest());
});
```

### Step 3: Save state on every change

Add a useEffect to auto-save:

```typescript
useEffect(() => {
  saveGameState(state);
}, [state]);
```

### Step 4: Clear saved state on new game

Modify the `newGame` callback:

```typescript
const newGame = useCallback(() => {
  setState((prev) => {
    const newState = initGameState(prev.bestScore);
    saveGameState(newState);
    return newState;
  });
}, []);
```

**Success criteria**: Refresh the page mid-game and see the exact board state restored.

### Troubleshooting

**Problem**: Old saved games cause errors  
**Cause**: Type structure changed  
**Solution**: Add version checking:

```typescript
interface SavedGame extends GameState {
  version?: number;
}

const CURRENT_VERSION = 1;

const loadGameState = (): GameState | null => {
  try {
    const raw = localStorage.getItem(GAME_STATE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as SavedGame;
    if (saved.version !== CURRENT_VERSION) return null;
    return saved;
  } catch {
    return null;
  }
};

const saveGameState = (state: GameState): void => {
  try {
    const saved: SavedGame = { ...state, version: CURRENT_VERSION };
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(saved));
  } catch {
    // storage unavailable
  }
};
```

---

## Task 6: Add Tile Animations

**Problem**: Tiles appear instantly without smooth movement animations.

The current implementation already includes basic CSS transitions. To enhance them:

### Step 1: Add move animations

Edit `/workshop/2048-react-game/src/App.css`:

```css
.tile {
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  aspect-ratio: 1;
  /* Enhanced transitions */
  transition: 
    transform 0.15s ease,
    grid-row 0.15s ease,
    grid-column 0.15s ease;
}

/* New tile pop-in animation */
@keyframes pop-in {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}

.tile-new {
  animation: pop-in 0.2s ease;
}
```

### Step 2: Mark new tiles in game logic

Edit `/workshop/2048-react-game/src/utils/gameLogic.ts` to add a flag:

```typescript
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
  next[r][c] = { 
    id: makeId(), 
    value: randomValue(), 
    row: r, 
    col: c,
    isNew: true // Add flag for animation
  };
  return next;
};
```

Update the Tile type:

```typescript
// In src/types/index.ts
export interface Tile {
  id: number;
  value: number;
  row: number;
  col: number;
  mergedFrom?: [Tile, Tile];
  isNew?: boolean; // Add optional flag
}
```

### Step 3: Apply animation class

Edit `/workshop/2048-react-game/src/components/Tile.tsx`:

```typescript
const Tile = ({ tile }: TileProps) => {
  const colors = TILE_COLORS[tile.value] ?? { bg: '#3c3a32', fg: '#f9f6f2' };
  return (
    <div
      className={`tile tile-${tile.value} ${tile.isNew ? 'tile-new' : ''}`}
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
```

**Verify it worked**: New tiles should scale up from zero when appearing.

### Alternative Approach: Use Framer Motion

For advanced animations (sliding, merging effects), install Framer Motion:

```bash
npm install framer-motion
```

Replace the tile div with:

```typescript
import { motion } from 'framer-motion';

const Tile = ({ tile }: TileProps) => {
  const colors = TILE_COLORS[tile.value] ?? { bg: '#3c3a32', fg: '#f9f6f2' };
  return (
    <motion.div
      layout
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
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
    </motion.div>
  );
};
```

---

## Task 7: Run and Write Tests

**Problem**: You need to test your changes or add tests for new features.

### Running tests

Run all tests:

```bash
cd /workshop/2048-react-game && npm run test
```

Run specific test file:

```bash
npm run test gameLogic.test.ts
```

Run tests in watch mode:

```bash
npm run test -- --watch
```

### Writing a new test for game logic

Create or edit test file in `/workshop/2048-react-game/src/utils/`:

```typescript
import { move, boardFromValues } from './gameLogic';

describe('move function', () => {
  it('combines two equal tiles when moving left', () => {
    const board = boardFromValues([
      [2, 2, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]);

    const result = move(board, 'left');
    
    expect(result.moved).toBe(true);
    expect(result.score).toBe(4);
    expect(result.board[0][0]?.value).toBe(4);
    expect(result.board[0][1]).toBeNull();
  });
});
```

### Writing tests for React components

Test a component in `/workshop/2048-react-game/src/components/`:

```typescript
import { render, screen } from '@testing-library/react';
import Tile from './Tile';

describe('Tile component', () => {
  it('renders tile value', () => {
    const tile = {
      id: 1,
      value: 128,
      row: 0,
      col: 0,
    };
    
    render(<Tile tile={tile} />);
    
    expect(screen.getByText('128')).toBeInTheDocument();
  });

  it('applies correct grid position', () => {
    const tile = {
      id: 1,
      value: 2,
      row: 2,
      col: 3,
    };
    
    const { container } = render(<Tile tile={tile} />);
    const element = container.firstChild as HTMLElement;
    
    expect(element.style.gridRow).toBe('3'); // row + 1
    expect(element.style.gridColumn).toBe('4'); // col + 1
  });
});
```

### Testing hooks

Test the useGame hook:

```typescript
import { renderHook, act } from '@testing-library/react';
import { useGame } from './useGame';

describe('useGame hook', () => {
  it('initializes with correct state', () => {
    const { result } = renderHook(() => useGame());
    
    expect(result.current.state.score).toBe(0);
    expect(result.current.state.won).toBe(false);
    expect(result.current.state.over).toBe(false);
  });

  it('creates new game', () => {
    const { result } = renderHook(() => useGame());
    const initialBoard = result.current.state.board;
    
    act(() => {
      result.current.newGame();
    });
    
    expect(result.current.state.board).not.toBe(initialBoard);
    expect(result.current.state.score).toBe(0);
  });
});
```

**Success criteria**: All tests pass with `npm run test`.

### Best Practices

- Run `npm run typecheck` before committing
- Test edge cases (empty board, full board, winning scenarios)
- Use `beforeEach` to reset test state
- Mock localStorage in tests to avoid side effects

---

## Task 8: Deploy the Game

**Problem**: You want to deploy the game to production.

### Step 1: Build the production bundle

```bash
cd /workshop/2048-react-game
npm run build
```

This creates optimized files in `/workshop/2048-react-game/dist/`.

**Expected output**: Build completes without errors, showing file sizes.

### Step 2: Test the production build locally

```bash
npm run preview
```

Open http://localhost:4173 to verify the build works.

### Deployment Option 1: Vercel (Recommended)

Vercel is zero-configuration for Vite projects:

```bash
npm install -g vercel
vercel
```

Follow prompts. Vercel auto-detects Vite and configures everything.

**For GitHub**: Push to GitHub, connect repository in Vercel dashboard.

### Deployment Option 2: Netlify

Create `/workshop/2048-react-game/netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Deploy via Netlify CLI:

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Deployment Option 3: GitHub Pages

Add to `/workshop/2048-react-game/package.json`:

```json
{
  "homepage": "https://yourusername.github.io/2048-react-game"
}
```

Edit `/workshop/2048-react-game/vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/2048-react-game/', // Add repo name
  server: {
    port: 3000,
    allowedHosts: ['.cloudfront.net'],
  },
})
```

Install gh-pages:

```bash
npm install --save-dev gh-pages
```

Add deploy script to `package.json`:

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

Deploy:

```bash
npm run deploy
```

**Success criteria**: Game is accessible at your deployment URL and all features work.

### Troubleshooting

**Problem**: 404 on refresh  
**Cause**: SPA routing needs server configuration  
**Solution**: Configure redirects (shown in Netlify example). For nginx:

```nginx
location / {
  try_files $uri /index.html;
}
```

**Problem**: Assets not loading  
**Cause**: Incorrect base path  
**Solution**: Set `base` in `vite.config.ts` to match deployment path

---

## Task 9: Clear Leaderboard Data

**Problem**: You need to reset or clear leaderboard entries during development or for testing.

### Option 1: Add a clear button to UI

Edit `/workshop/2048-react-game/src/components/LeaderboardPopup.tsx`:

```typescript
import { loadLeaderboard } from '../utils/leaderboard';

interface LeaderboardPopupProps {
  onClose: () => void;
}

const LeaderboardPopup = ({ onClose }: LeaderboardPopupProps) => {
  const [entries, setEntries] = useState(loadLeaderboard());

  const handleClear = () => {
    if (confirm('Clear all leaderboard entries?')) {
      localStorage.removeItem('2048-leaderboard');
      setEntries([]);
    }
  };

  return (
    <div className="leaderboard-backdrop" onClick={onClose}>
      <div className="leaderboard-popup" onClick={(e) => e.stopPropagation()}>
        <div className="leaderboard-header">
          <h2>Leaderboard</h2>
          <button className="leaderboard-close" onClick={onClose}>×</button>
        </div>
        
        {/* Add clear button */}
        <button 
          onClick={handleClear}
          style={{ 
            width: '100%', 
            marginBottom: '12px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '8px',
            cursor: 'pointer'
          }}
        >
          Clear All Entries
        </button>

        {/* Existing list rendering */}
      </div>
    </div>
  );
};
```

### Option 2: Clear via browser console

Open browser DevTools Console and run:

```javascript
localStorage.removeItem('2048-leaderboard');
console.log('Leaderboard cleared');
```

Refresh the page.

### Option 3: Add utility function

Create `/workshop/2048-react-game/src/utils/leaderboard.ts`:

```typescript
export const clearLeaderboard = (): void => {
  try {
    localStorage.removeItem(LEADERBOARD_KEY);
  } catch {
    // storage unavailable
  }
};
```

Call from anywhere:

```typescript
import { clearLeaderboard } from './utils/leaderboard';

// In development or testing
clearLeaderboard();
```

**Success criteria**: Leaderboard shows "No entries yet" after clearing.

### For Development: Add keyboard shortcut

In `/workshop/2048-react-game/src/hooks/useGame.ts`:

```typescript
const onKey = (e: KeyboardEvent) => {
  // ... existing code ...
  
  // Add clear shortcut (Ctrl+Shift+C)
  if (e.key === 'C' && e.ctrlKey && e.shiftKey) {
    if (confirm('Clear leaderboard?')) {
      localStorage.removeItem('2048-leaderboard');
      localStorage.removeItem('2048-best-score');
      window.location.reload();
    }
  }
};
```

---

## Task 10: Add Custom Keyboard Shortcuts

**Problem**: You want to add shortcuts for common actions beyond arrow keys.

### Existing shortcuts

The game already handles:
- Arrow keys: Move tiles
- (If you added undo): Ctrl/Cmd+Z: Undo

### Add shortcut for new game

Edit `/workshop/2048-react-game/src/hooks/useGame.ts`:

```typescript
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
    // Add N for new game
    else if (e.key === 'n' || e.key === 'N') {
      e.preventDefault();
      newGame();
    }
  };
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
}, [handleMove, newGame]); // Add newGame to dependencies
```

### Add WASD controls

Map WASD keys to directions:

```typescript
const onKey = (e: KeyboardEvent) => {
  const map: Record<string, Direction> = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
    w: 'up',        // Add WASD
    W: 'up',
    s: 'down',
    S: 'down',
    a: 'left',
    A: 'left',
    d: 'right',
    D: 'right',
  };
  const dir = map[e.key];
  if (dir) {
    e.preventDefault();
    handleMove(dir);
  }
};
```

### Add help modal shortcut

```typescript
// In App.tsx
const [showHelp, setShowHelp] = useState(false);

useEffect(() => {
  const onKey = (e: KeyboardEvent) => {
    if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
      setShowHelp(true);
    } else if (e.key === 'Escape') {
      setShowHelp(false);
    }
  };
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
}, []);

return (
  <div className="app">
    {/* ... existing content ... */}
    
    {showHelp && (
      <div className="overlay">
        <h2>Keyboard Shortcuts</h2>
        <ul>
          <li>Arrow Keys / WASD - Move tiles</li>
          <li>N - New game</li>
          <li>Ctrl+Z - Undo</li>
          <li>? - This help</li>
        </ul>
        <button onClick={() => setShowHelp(false)}>Close</button>
      </div>
    )}
  </div>
);
```

**Success criteria**: Pressing the shortcut keys performs the expected actions.

### Best Practices

- Always call `e.preventDefault()` for custom shortcuts to avoid browser defaults
- Document shortcuts in the UI (help modal or instructions text)
- Avoid overriding common browser shortcuts (Ctrl+R, Ctrl+T, etc.)
- Make shortcuts case-insensitive for better UX
- Consider adding visual feedback for shortcuts (e.g., button highlight)

### Troubleshooting

**Problem**: Shortcuts interfere with browser functions  
**Solution**: Only preventDefault for game-specific keys, allow Ctrl+R, Ctrl+W, etc. to work normally

**Problem**: Shortcuts trigger when typing in input fields  
**Solution**: Check if active element is an input:

```typescript
if (document.activeElement?.tagName === 'INPUT') return;
```

---

## Related Tasks

- **New to this project?** Start with the [Getting Started Tutorial](../tutorials/2048-game-tutorial.md)
- **Need technical details?** Check the [API Reference](../reference/2048-game-api.md)
- **Want to understand architecture?** Read about [Design Concepts](../explanation/2048-game-concepts.md)

## Verification Checklist

After making changes, always run:

```bash
npm run typecheck  # Verify TypeScript types
npm run lint       # Check code style
npm run test       # Run unit tests
npm run build      # Verify production build works
```

## Quick Reference: File Locations

- **Game logic**: `/workshop/2048-react-game/src/utils/gameLogic.ts`
- **Game state**: `/workshop/2048-react-game/src/hooks/useGame.ts`
- **Types**: `/workshop/2048-react-game/src/types/index.ts`
- **Tile styling**: `/workshop/2048-react-game/src/components/Tile.tsx`
- **Board rendering**: `/workshop/2048-react-game/src/components/Board.tsx`
- **Main app**: `/workshop/2048-react-game/src/App.tsx`
- **Styles**: `/workshop/2048-react-game/src/App.css`
- **Build config**: `/workshop/2048-react-game/vite.config.ts`
