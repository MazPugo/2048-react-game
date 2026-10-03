import { render, screen, fireEvent } from '@testing-library/react';
import LeaderboardPopup from './LeaderboardPopup';
import type { LeaderboardEntry } from '../types';

const entries: LeaderboardEntry[] = [
  { score: 2048, date: '1/1/2025' },
  { score: 512, date: '1/2/2025' },
];

describe('LeaderboardPopup', () => {
  it('renders all entries', () => {
    render(<LeaderboardPopup entries={entries} onClose={() => {}} />);
    expect(screen.getByText('2,048')).toBeInTheDocument();
    expect(screen.getByText('512')).toBeInTheDocument();
  });

  it('shows empty state when no entries', () => {
    render(<LeaderboardPopup entries={[]} onClose={() => {}} />);
    expect(screen.getByText(/no scores yet/i)).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    const onClose = jest.fn();
    render(<LeaderboardPopup entries={entries} onClose={onClose} />);
    fireEvent.click(screen.getByLabelText('Close leaderboard'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop clicked', () => {
    const onClose = jest.fn();
    render(<LeaderboardPopup entries={entries} onClose={onClose} />);
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when popup content clicked', () => {
    const onClose = jest.fn();
    render(<LeaderboardPopup entries={entries} onClose={onClose} />);
    fireEvent.click(screen.getByText('Leaderboard'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('marks the top entry with leaderboard-top class', () => {
    const { container } = render(<LeaderboardPopup entries={entries} onClose={() => {}} />);
    const items = container.querySelectorAll('li');
    expect(items[0]).toHaveClass('leaderboard-top');
    expect(items[1]).not.toHaveClass('leaderboard-top');
  });
});
