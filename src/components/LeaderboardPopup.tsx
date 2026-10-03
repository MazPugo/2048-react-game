import type { LeaderboardEntry } from '../types';

interface Props {
  /** Leaderboard entries sorted by score descending */
  entries: LeaderboardEntry[];
  /** Called when the popup should close */
  onClose: () => void;
}

const LeaderboardPopup = ({ entries, onClose }: Props) => (
  <div
    className="leaderboard-backdrop"
    onClick={onClose}
    role="dialog"
    aria-modal="true"
    aria-label="Leaderboard"
  >
    <div className="leaderboard-popup" onClick={(e) => e.stopPropagation()}>
      <div className="leaderboard-header">
        <h2>Leaderboard</h2>
        <button className="leaderboard-close" onClick={onClose} aria-label="Close leaderboard">
          ×
        </button>
      </div>
      {entries.length === 0 ? (
        <p className="leaderboard-empty">No scores yet. Play a game!</p>
      ) : (
        <ol className="leaderboard-list">
          {entries.map((entry, i) => (
            <li key={i} className={i === 0 ? 'leaderboard-top' : ''}>
              <span className="leaderboard-rank">#{i + 1}</span>
              <span className="leaderboard-score">{entry.score.toLocaleString()}</span>
              <span className="leaderboard-date">{entry.date}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  </div>
);

export default LeaderboardPopup;
