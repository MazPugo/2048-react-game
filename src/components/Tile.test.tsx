import { render, screen } from '@testing-library/react';
import Tile from './Tile';
import { Tile as TileType } from '../types';

const makeTile = (value: number): TileType => ({ id: 1, value, row: 0, col: 0 });

describe('Tile', () => {
  it('renders the tile value', () => {
    render(<Tile tile={makeTile(2)} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('applies tile-<value> class', () => {
    const { container } = render(<Tile tile={makeTile(16)} />);
    expect(container.firstChild).toHaveClass('tile-16');
  });

  it('uses the correct background color for value 8', () => {
    const { container } = render(<Tile tile={makeTile(8)} />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.backgroundColor).toBe('rgb(242, 177, 121)');
  });

  it('renders high values', () => {
    render(<Tile tile={makeTile(2048)} />);
    expect(screen.getByText('2048')).toBeInTheDocument();
  });
});
