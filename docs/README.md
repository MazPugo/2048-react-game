# 2048 React Game Documentation

## Documentation Guide

| Document | Audience | Purpose |
|----------|----------|---------|
| [Tutorial](tutorials/2048-game-tutorial.md) | Beginners | Step-by-step learning journey |
| [How-to Guides](how-to/2048-game-tasks.md) | Practitioners | Solve specific problems |
| [Reference](reference/2048-game-api.md) | All users | Complete technical specifications |
| [Explanation](explanation/2048-game-concepts.md) | Architects | Design decisions and concepts |

## Quick Start

- **New to the project?** Start with the [Tutorial](tutorials/2048-game-tutorial.md)
- **Need to do a specific task?** Check the [How-to Guides](how-to/2048-game-tasks.md)
- **Looking up an API?** See the [Reference](reference/2048-game-api.md)
- **Want to understand the design?** Read the [Explanation](explanation/2048-game-concepts.md)

## Project Overview

A 2048 sliding puzzle game built with React 19, TypeScript 6, and Vite 8. The architecture separates pure game logic from UI state management and rendering:

```
src/
  types/       TypeScript type definitions
  utils/       Pure game logic and leaderboard persistence
  hooks/       useGame custom hook (state, keyboard, localStorage)
  components/  Board, Tile, Header, Leaderboard, LeaderboardPopup
  App.tsx      Root composition
```
