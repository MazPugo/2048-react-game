import { useState } from 'react';
import { loadLeaderboard } from '../utils/leaderboard';
import LeaderboardPopup from './LeaderboardPopup';

const Leaderboard = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="leaderboard-btn" onClick={() => setOpen(true)}>
        Leaderboard
      </button>
      {open && <LeaderboardPopup entries={loadLeaderboard()} onClose={() => setOpen(false)} />}
    </>
  );
};

export default Leaderboard;
