import { render, screen, fireEvent } from '@testing-library/react';
import { ReleaseDocumentTabs } from './ReleaseDocumentTabs';
import { MOCK_RELEASES, getMockReleaseItems } from '@entities/release';

describe('ReleaseDocumentTabs', () => {
  const release = MOCK_RELEASES[0]; // v1.8.0 RELEASED
  const items = getMockReleaseItems(release.id);

  it('shows Overview tab by default with items list', () => {
    render(<ReleaseDocumentTabs release={release} items={items} />);

    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
    // Overview shows ticker numbers and titles from items
    expect(screen.getByText('ABC-123')).toBeInTheDocument();
    expect(screen.getByText('로그인 실패 안내 문구 개선')).toBeInTheDocument();
  });

  it('switches to CHANGELOG tab and shows grouped changelog', () => {
    render(<ReleaseDocumentTabs release={release} items={items} />);

    fireEvent.click(screen.getByRole('tab', { name: 'CHANGELOG' }));

    expect(screen.getByRole('tab', { name: 'CHANGELOG' })).toHaveAttribute('aria-selected', 'true');
    // CHANGELOG shows category group headings
    expect(screen.getByText('Major')).toBeInTheDocument();
    expect(screen.getByText('Minor')).toBeInTheDocument();
    // CHANGELOG shows item summaries
    expect(screen.getByText('로그인 실패 안내 문구 개선')).toBeInTheDocument();
  });

  it('switches to QC Checklist tab and shows test cases with status', () => {
    render(<ReleaseDocumentTabs release={release} items={items} />);

    fireEvent.click(screen.getByRole('tab', { name: 'QC Checklist' }));

    expect(screen.getByText('로그인 실패 시 에러 메시지 확인')).toBeInTheDocument();
    // Multiple PASSED cells exist (tc-001, tc-002 are both PASSED)
    expect(screen.getAllByText('Passed').length).toBeGreaterThan(0);
  });

  it('switches to Release Note tab and shows only public items', () => {
    render(<ReleaseDocumentTabs release={release} items={items} />);

    fireEvent.click(screen.getByRole('tab', { name: 'Release Note' }));

    // isPublic=true items are shown
    expect(screen.getByText('로그인 실패 안내 문구 개선')).toBeInTheDocument();
    // ri-004 '알림 목록 UI 개선' is isPublic=false and must NOT appear
    expect(screen.queryByText('알림 목록 UI 개선')).not.toBeInTheDocument();
  });

  it('switches to Announcement tab and shows formatted announcement text', () => {
    render(<ReleaseDocumentTabs release={release} items={items} />);

    fireEvent.click(screen.getByRole('tab', { name: 'Announcement' }));

    // Announcement text is inside <pre> to avoid multi-match from ancestor elements
    expect(
      screen.getByText(/v1\.8\.0 릴리즈 변경사항/, { selector: 'pre' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/#개발팀/, { selector: 'pre' })).toBeInTheDocument();
  });
});
