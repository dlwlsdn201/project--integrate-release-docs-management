import { render, screen } from '@testing-library/react';
import { MOCK_RELEASES, MOCK_RELEASE_ITEMS } from '@entities/release';
import { ReleaseListPanel } from './ReleaseListPanel';

describe('ReleaseListPanel', () => {
  it('릴리즈 목록 표에 접근 가능한 이름을 제공한다', () => {
    render(
      <ReleaseListPanel
        releases={MOCK_RELEASES}
        allItems={MOCK_RELEASE_ITEMS}
        onSelectRelease={vi.fn()}
      />,
    );

    expect(screen.getByRole('table', { name: '릴리즈 목록 테이블' })).toBeInTheDocument();
  });

  it('빈 목록 상태를 status로 노출한다', () => {
    render(<ReleaseListPanel releases={[]} allItems={[]} onSelectRelease={vi.fn()} />);

    expect(screen.getByRole('status')).toHaveTextContent('릴리즈가 없습니다.');
  });
});
