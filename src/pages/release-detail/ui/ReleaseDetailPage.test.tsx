import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReleaseDetailPage } from './ReleaseDetailPage';

describe('ReleaseDetailPage', () => {
  it('릴리즈 항목 제출 후 문서 탭에 새 항목이 반영된다', async () => {
    const user = userEvent.setup();
    render(<ReleaseDetailPage releaseId="release-v1.8.0" onBack={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: '+ 릴리즈 항목 추가' }));
    await user.type(screen.getByLabelText(/이슈 번호/), 'ABC-999');
    await user.type(screen.getByLabelText(/제목/), '권한 설정 화면 개선');
    await user.type(screen.getByLabelText(/담당자/), '홍길동');
    await user.type(screen.getByLabelText(/CHANGELOG 요약/), '권한 설정 화면 개선');
    await user.type(screen.getByLabelText(/사용자용 설명/), '권한 설정 화면이 더 명확해졌습니다.');
    await user.click(screen.getByRole('button', { name: '저장' }));

    await waitFor(() => {
      expect(screen.getByText('ABC-999')).toBeInTheDocument();
    });
    expect(screen.getByText('권한 설정 화면 개선')).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'CHANGELOG' }));

    expect(screen.getByText('권한 설정 화면 개선')).toBeInTheDocument();
  });

  it('releaseId가 바뀌면 해당 릴리즈의 항목으로 다시 초기화된다', async () => {
    const { rerender } = render(
      <ReleaseDetailPage releaseId="release-v1.8.0" onBack={vi.fn()} />,
    );

    expect(screen.getByText('ABC-123')).toBeInTheDocument();

    rerender(<ReleaseDetailPage releaseId="release-v1.9.0" onBack={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('ABC-170')).toBeInTheDocument();
    });
    expect(screen.queryByText('ABC-123')).not.toBeInTheDocument();
  });
});
