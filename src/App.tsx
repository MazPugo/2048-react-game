import { Board, Header, Leaderboard } from './components';
import { useGame } from './hooks/useGame';
import './App.css';

const App = () => {
  const { state, newGame, keepPlaying } = useGame();

  return (
    <div className="app">
      <Header score={state.score} bestScore={state.bestScore} onNewGame={newGame} />

      <p className="instructions">
        Join the numbers and get to the <strong>2048 tile!</strong>
      </p>

      <div className="board-wrapper">
        <Board board={state.board} />

        {state.won && !state.keepPlaying && (
          <div className="overlay won-overlay">
            <p>You win!</p>
            <div className="overlay-buttons">
              <button onClick={keepPlaying}>Keep going</button>
              <button onClick={newGame}>New game</button>
            </div>
          </div>
        )}

        {state.over && (
          <div className="overlay over-overlay">
            <p>Game over!</p>
            <button onClick={newGame}>Try again</button>
          </div>
        )}
      </div>

      <p className="instructions small">
        Use arrow keys to move tiles.
      </p>

      <div className="leaderboard-footer">
        <Leaderboard />
      </div>
    </div>
  );
};

export default App;
