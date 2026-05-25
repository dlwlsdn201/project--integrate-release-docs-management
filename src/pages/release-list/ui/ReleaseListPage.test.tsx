import { render, screen, fireEvent } from '@testing-library/react';
import { ReleaseListPage } from './ReleaseListPage';

describe('ReleaseListPage', () => {
  it('shows release versions and statuses', () => {
    render(<ReleaseListPage onSelectRelease={() => undefined} />);

    expect(screen.getByText('v1.8.0')).toBeInTheDocument();
    expect(screen.getByText('v1.9.0')).toBeInTheDocument();
    expect(screen.getByText('Released')).toBeInTheDocument();
    expect(screen.getByText('QC Ready')).toBeInTheDocument();
  });

  it('shows issue count and QC progress per release', () => {
    render(<ReleaseListPage onSelectRelease={() => undefined} />);

    // v1.8.0 has 4 items, v1.9.0 has 1 item
    const issueCells = screen.getAllByRole('cell');
    const issueCounts = issueCells.map((cell) => cell.textContent);
    expect(issueCounts).toContain('4');
    expect(issueCounts).toContain('1');
  });

  it('calls onSelectRelease with the correct release id when a row is clicked', () => {
    const onSelectRelease = vi.fn();
    render(<ReleaseListPage onSelectRelease={onSelectRelease} />);

    fireEvent.click(screen.getByText('v1.8.0'));

    expect(onSelectRelease).toHaveBeenCalledWith('release-v1.8.0');
  });
});
