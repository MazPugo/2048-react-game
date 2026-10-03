# Getting Started with the 2048 React Game: Build Your First Feature

**What you'll learn**: By the end of this tutorial, you'll understand how the 2048 game works, how its code is organized, and how to add a simple new feature. You'll be ready to customize the game and build your own features.

**Time required**: 45 minutes
**Prerequisites**: 
- Basic knowledge of JavaScript
- Familiarity with command line/terminal
- Node.js 18 or higher installed on your computer

## What You'll Build

You'll start by running the 2048 game, then explore how it works by reading through the code in a logical order. Finally, you'll add a new feature: a **move counter** that displays how many moves the player has made.

### Why This Tutorial Matters

This tutorial teaches you a real React application architecture that separates concerns clearly: types define your data, utilities handle pure logic, hooks manage state, and components display the UI. This pattern scales to much larger applications.

## Before We Start

### Verify Node.js Installation

First, make sure you have Node.js installed:

```bash
node --version
```

**Expected output**: `v18.0.0` or higher (your exact version may differ)

**Checkpoint**: If you see a version number, you're ready to continue. If not, [download Node.js](https://nodejs.org/) first.

### Navigate to the Project

```bash
cd /workshop/2048-react-game
```

### Install Dependencies

Install all the packages the game needs:

```bash
npm install
```

**What just happened**: npm downloaded React, TypeScript, Vite, and other tools the project needs.

**Checkpoint**: You should see a progress bar and finally `added XXX packages` message. This might take 1-2 minutes.

## Step 1: Run the Game

Let's start the development server and play the game:

```bash
npm run dev
```

**Expected output**:
```
  VITE v8.3.0  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

**Checkpoint**: Open your browser to `http://localhost:3000/`. You should see the 2048 game with a 4x4 grid containing two tiles.

### Play the Game

Use your arrow keys (up, down, left, right) to slide the tiles. When two tiles with the same number touch, they merge into one.

**Try it**: Press the arrow keys a few times and watch the tiles move and merge.

**What you're experiencing**: 
- Arrow keys move all tiles in that direction
- Matching numbers merge and double in value
- A new tile (2 or 4) appears after each move
- Your score increases when tiles merge
- Game over happens when the board is full and no moves are possible

## Step 2: Understand the Project Structure

Let's explore how the code is organized. Leave the dev server running (you can open a new terminal tab) or press `Ctrl+C` to stop it.

### View the File Structure

```bash
ls -la src/
```

**Expected output**: You'll see directories like `components/`, `hooks/`, `utils/`, `types/`

**What just happened**: You're seeing a well-organized React project structure where each folder has a specific purpose.

Here's what each directory does:

- **`types/`**: Defines TypeScript types (what data looks like)
- **`utils/`**: Contains pure functions (game logic without React)
- **`hooks/`**: Custom React hooks (state management)
- **`components/`**: React components (what you see on screen)

## Step 3: Explore the Types (Understanding the Data)

Let's start by understanding what data the game uses:

```bash
cat src/types/index.ts
```

**What you're seeing**:

1. **`Direction`**: The four ways tiles can move (up, down, left, right)
2. **`Tile`**: A single tile with an id, value (2, 4, 8, etc.), position (row, col)
3. **`Board`**: A 4x4 grid of tiles (or empty spaces)
4. **`GameState`**: Everything about the current game (board, score, win/lose status)
5. **`LeaderboardEntry`**: A saved high score with date

**Checkpoint**: You should see TypeScript types and interfaces. These are like blueprints that describe what your data looks like.

## Step 4: Explore the Game Logic (How the Game Works)

Now let's look at the game logic functions:

```bash
cat src/utils/gameLogic.ts
```

**Key functions you're seeing**:

1. **`emptyBoard()`**: Creates a blank 4x4 grid
2. **`addRandomTile(board)`**: Adds a new tile (2 or 4) to a random empty space
3. **`initBoard()`**: Creates a new game board with two starting tiles
4. **`slideRow(row)`**: Moves and merges tiles in a single row (the core game mechanic)
5. **`move(board, direction)`**: Moves all tiles in a direction and returns the new board
6. **`hasWon(board)`**: Checks if any tile reached 2048
7. **`isGameOver(board)`**: Checks if no more moves are possible

**What's clever here**: The `move()` function handles all four directions by transforming the board. It converts up/down/right moves into left moves by rotating and flipping the board, then rotating back. This means the sliding logic only needs to be written once.

**Checkpoint**: These are pure functions. They take input, return output, and don't modify anything outside themselves. This makes them easy to test and reason about.

## Step 5: Explore the Game Hook (Managing State)

Now let's see how the game manages state with React:

```bash
cat src/hooks/useGame.ts
```

**What this hook does**:

1. **Manages `GameState`**: Keeps track of the board, score, best score, and win/lose status
2. **Provides `newGame()`**: Resets the game with a fresh board
3. **Provides `keepPlaying()`**: Lets you continue after winning
4. **Provides `handleMove(direction)`**: Updates the game when you press arrow keys
5. **Listens to keyboard**: Automatically responds to arrow key presses
6. **Persists best score**: Saves your high score to browser storage
7. **Updates leaderboard**: Saves your score when the game ends

**What just happened**: This hook is the bridge between the pure game logic and React's UI updates. When you press an arrow key, it calls the game logic functions and updates the React state, which causes the UI to re-render.

**Checkpoint**: Notice how the hook uses `useCallback` and `useEffect`. These are React hooks that optimize performance and handle side effects (like keyboard listeners).

## Step 6: Explore the Components (The Visual Interface)

Let's look at the visual components one by one.

### The Tile Component

```bash
cat src/components/Tile.tsx
```

**What you're seeing**: Each tile is positioned using CSS Grid (row and column), colored based on its value (2 is light, 2048 is golden), and displays its number.

### The Board Component

```bash
cat src/components/Board.tsx
```

**What you're seeing**: The board has two layers:
1. A grid of 16 empty cells (the background)
2. An overlay of actual tiles positioned on top

This separation makes animations smooth because tiles can move over the fixed grid.

### The App Component

```bash
cat src/components/Header.tsx
cat src/App.tsx
```

**What you're seeing**: The `App` component puts everything together:
1. Uses the `useGame()` hook to get game state and actions
2. Displays the `Header` with score and New Game button
3. Displays the `Board` with all tiles
4. Shows win/game-over overlays when appropriate
5. Shows the `Leaderboard` at the bottom

**Checkpoint**: This is React's component composition pattern. Small, focused components are combined to build the full interface.

## Step 7: Add Your First Feature (Move Counter)

Now let's add a new feature: count how many moves the player has made.

### Modify the GameState Type

First, we need to add a `moves` field to track the count. Open the types file:

```bash
cat src/types/index.ts
```

Add the `moves` field to the `GameState` interface. We'll update it manually:

**Edit `src/types/index.ts`** - Add `moves: number;` after `score: number;`:

```typescript
export interface GameState {
  board: Board;
  score: number;
  moves: number;  // Add this line
  bestScore: number;
  won: boolean;
  over: boolean;
  keepPlaying: boolean;
}
```

**What you did**: You added a new field to the GameState type that will track the move count.

### Update the Game Logic Initialization

Next, update `initGameState` to initialize moves to 0.

**Edit `src/utils/gameLogic.ts`** - Find the `initGameState` function and add `moves: 0`:

```typescript
export const initGameState = (bestScore = 0): GameState => ({
  board: initBoard(),
  score: 0,
  moves: 0,  // Add this line
  bestScore,
  won: false,
  over: false,
  keepPlaying: false,
});
```

**What you did**: When a new game starts, the move counter starts at 0.

### Update the Hook to Increment Moves

Now update the `useGame` hook to increment the counter on each move.

**Edit `src/hooks/useGame.ts`** - Find the `handleMove` function and update the return statement:

```typescript
return {
  ...prev,
  board: newBoard,
  score: newScore,
  moves: prev.moves + 1,  // Add this line
  bestScore: newBest,
  won: !prev.won && hasWon(newBoard),
  over: gameOver,
};
```

**What you did**: Every time the player makes a valid move, the counter increases by 1.

### Display the Move Counter

Finally, let's show the move count in the UI.

**Edit `src/App.tsx`** - Add a new paragraph below the instructions:

```typescript
<p className="instructions">
  Join the numbers and get to the <strong>2048 tile!</strong>
</p>

<p className="instructions small">
  Moves: {state.moves}
</p>
```

**What you did**: You added a new UI element that displays the current move count.

### Verify Your Changes

Start the dev server again if it's not running:

```bash
npm run dev
```

Open `http://localhost:3000/` and play the game. You should see "Moves: 0" initially, and it should increment each time you press an arrow key.

**Checkpoint**: If you see the move counter increasing with each move, congratulations! You've successfully added a new feature.

## Step 8: Test Your Changes

Let's make sure we didn't break anything.

### Run Type Checking

```bash
npm run typecheck
```

**Expected output**: No errors (the command completes silently or shows "no errors")

**What just happened**: TypeScript verified that all your types are correct and consistent.

### Run the Tests

```bash
npm run test
```

**Expected output**: You'll see test results. Some tests might fail because we changed the `GameState` structure.

**What's happening**: The existing tests expect the old structure without the `moves` field. In a real project, you would update the tests, but for this tutorial, this shows you how tests catch breaking changes.

**Checkpoint**: TypeScript compiles successfully, and you understand that tests need updating when you change data structures.

## What You've Accomplished

You've successfully:
- Installed and run the 2048 game
- Explored the project structure (types, utils, hooks, components)
- Understood how data flows from types through logic to UI
- Added a new feature (move counter) by modifying types, logic, hook, and UI
- Tested your changes with TypeScript

## Next Steps

Now that you understand the basics:

- **Solve Specific Problems**: Want to add more features like undo, save/load, or touch controls? Check out our [How-to Guides](../how-to/2048-game-tasks.md)
- **Look Up Details**: Need to know all the parameters for a function? Browse the [Reference Documentation](../reference/2048-game-api.md)
- **Understand Design Decisions**: Curious why the code is structured this way? Read about [Architecture Concepts](../explanation/2048-game-concepts.md)

### Ideas for Practice

Try adding these features on your own:

1. **Timer**: Display how long the game has been running
2. **Largest Tile**: Show the highest tile value achieved
3. **Undo Button**: Let players undo their last move (hint: store previous board state)
4. **Tile Counter**: Display how many tiles are currently on the board

## Troubleshooting

**Problem**: Port 3000 is already in use
**Solution**: Either stop the other process using port 3000, or edit `vite.config.ts` to use a different port:
```typescript
export default defineConfig({
  server: { port: 3001 }
})
```

**Problem**: `npm install` fails with permission errors
**Solution**: Don't use `sudo`. If you have permission issues, you may need to fix your npm configuration:
```bash
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

**Problem**: Types don't match after adding the `moves` field
**Solution**: Make sure you added `moves: number;` to the `GameState` interface and `moves: 0` to the `initGameState` function. TypeScript will show exactly which files have errors.

**Problem**: Move counter doesn't update
**Solution**: Verify you added `moves: prev.moves + 1` in the `handleMove` function's return statement. Make sure it's inside the object returned when `didMove` is true.

**Problem**: Tests fail after changes
**Solution**: This is expected. When you change data structures, you need to update tests that use those structures. In `src/utils/gameLogic.test.ts` and `src/hooks/useGame.test.ts`, add `moves: 0` to any test data that creates a `GameState` object.

For more troubleshooting help, see our [How-to Guides](../how-to/2048-game-tasks.md).
