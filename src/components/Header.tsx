interface HeaderProps {
  /** Current game score */
  score: number;
  /** All-time best score */
  bestScore: number;
  /** Callback to start a new game */
  onNewGame: () => void;
}

const Header = ({ score, bestScore, onNewGame }: HeaderProps) => (
  <header className="header">
    <div className="title">2048</div>
    <div className="header-right">
      <div className="scores">
        <div className="score-box">
          <span className="score-label">SCORE</span>
          <span className="score-value">{score}</span>
        </div>
        <div className="score-box">
          <span className="score-label">BEST</span>
          <span className="score-value">{bestScore}</span>
        </div>
      </div>
      <button className="new-game-btn" onClick={onNewGame}>
        New Game
      </button>
    </div>
  </header>
);

export default Header;
