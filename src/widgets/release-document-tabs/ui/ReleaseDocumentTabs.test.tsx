import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReleaseDocumentTabs } from './ReleaseDocumentTabs';
import { MOCK_RELEASES, getMockReleaseItems } from '@entities/release';

describe('ReleaseDocumentTabs', () => {
  const release = MOCK_RELEASES[0]; // v1.8.0 RELEASED
  const items = getMockReleaseItems(release.id);

  it('shows Overview tab by default with items list', () => {
    render(<ReleaseDocumentTabs release={release} items={items} />);

    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: 'Overview' })).toBeInTheDocument();
    // Overview shows ticker numbers and titles from items
    expect(screen.getByText('ABC-123')).toBeInTheDocument();
    expect(screen.getByText('로그인 실패 안내 문구 개선')).toBeInTheDocument();
  });

  it('switches to CHANGELOG tab and shows grouped changelog', () => {
    render(<ReleaseDocumentTabs release={release} items={items} />);

    fireEvent.click(screen.getByRole('tab', { name: 'CHANGELOG' }));

    expect(screen.getByRole('tab', { name: 'CHANGELOG' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('v1.8.0 릴리즈')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Major 2건' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Minor 2건' })).toBeInTheDocument();
    expect(screen.getByText('로그인 실패 안내 문구 개선')).toBeInTheDocument();
  });

  it('switches to QC Checklist tab and shows test cases with status', () => {
    render(<ReleaseDocumentTabs release={release} items={items} />);

    fireEvent.click(screen.getByRole('tab', { name: 'QC Checklist' }));

    expect(screen.getByText('총 4개 테스트 케이스')).toBeInTheDocument();
    expect(screen.getByText('Passed 2')).toBeInTheDocument();
    expect(screen.getByText('Not Started 2')).toBeInTheDocument();
    expect(screen.getByText('로그인 실패 시 에러 메시지 확인')).toBeInTheDocument();
    expect(screen.getAllByText('Passed').length).toBeGreaterThan(0);
  });

  it('switches to Release Note tab and shows only public items', () => {
    render(<ReleaseDocumentTabs release={release} items={items} />);

    fireEvent.click(screen.getByRole('tab', { name: 'Release Note' }));

    expect(screen.getByText('공개 항목 3개')).toBeInTheDocument();
    expect(screen.getByText('비공개 항목 1개')).toBeInTheDocument();
    expect(screen.getByText('로그인 실패 안내 문구 개선')).toBeInTheDocument();
    expect(screen.queryByText('알림 목록 UI 개선')).not.toBeInTheDocument();
  });

  it('switches to Announcement tab and shows formatted announcement text', () => {
    render(<ReleaseDocumentTabs release={release} items={items} />);

    fireEvent.click(screen.getByRole('tab', { name: 'Announcement' }));

    const announcementPreview = screen.getByRole('textbox', {
      name: '공지문 미리보기',
    }) as HTMLTextAreaElement;

    expect(announcementPreview.value).toContain('v1.8.0 릴리즈 변경사항');
    expect(announcementPreview.value).toContain('#개발팀');
  });

  it('copies announcement text to clipboard', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    render(<ReleaseDocumentTabs release={release} items={items} />);

    await user.click(screen.getByRole('button', { name: '공지문 복사' }));

    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('#개발팀'));
    expect(screen.getByText('공지문을 복사했습니다.')).toBeInTheDocument();
  });
});
