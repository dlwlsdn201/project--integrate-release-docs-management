import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReleaseItemForm } from './ReleaseItemForm';

describe('ReleaseItemForm', () => {
  it('GitLab Issue 선택 시 제목·이슈 번호·담당자가 자동 채워진다', async () => {
    const user = userEvent.setup();
    render(
      <ReleaseItemForm releaseId="release-1" onSubmit={vi.fn()} onCancel={vi.fn()} />,
    );

    await user.selectOptions(screen.getByLabelText('Issue 선택'), '1001');

    await waitFor(() => {
      expect(screen.getByLabelText(/이슈 번호/)).toHaveValue('#123');
    });
    expect(screen.getByLabelText(/제목/)).toHaveValue('로그인 실패 안내 문구 개선');
    expect(screen.getByLabelText(/담당자/)).toHaveValue('김개발');
  });

  it('GitLab MR 선택 시 제목·티켓 번호·담당자가 자동 채워진다', async () => {
    const user = userEvent.setup();
    render(
      <ReleaseItemForm releaseId="release-1" onSubmit={vi.fn()} onCancel={vi.fn()} />,
    );

    await user.selectOptions(screen.getByLabelText('MR 선택'), '2001');

    await waitFor(() => {
      expect(screen.getByLabelText(/이슈 번호/)).toHaveValue('!88');
    });
    expect(screen.getByLabelText(/제목/)).toHaveValue(
      'feat: 로그인 실패 안내 문구 개선 (closes #123)',
    );
    expect(screen.getByLabelText(/담당자/)).toHaveValue('김개발');
  });

  it('GitLab Issue URL 입력 시 매칭된 issue 기본 정보가 채워진다', async () => {
    const user = userEvent.setup();
    render(
      <ReleaseItemForm releaseId="release-1" onSubmit={vi.fn()} onCancel={vi.fn()} />,
    );

    await user.type(
      screen.getByLabelText(/URL로 자동 채우기/),
      'https://gitlab.example.com/project/-/issues/123',
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/이슈 번호/)).toHaveValue('#123');
    });
    expect(screen.getByLabelText(/제목/)).toHaveValue('로그인 실패 안내 문구 개선');
  });

  it('GitLab MR URL 입력 시 MR URL만 제출 데이터에 포함된다', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <ReleaseItemForm releaseId="release-1" onSubmit={onSubmit} onCancel={vi.fn()} />,
    );

    await user.type(
      screen.getByLabelText(/URL로 자동 채우기/),
      'https://gitlab.example.com/project/-/merge_requests/88',
    );
    await user.type(screen.getByLabelText(/CHANGELOG 요약/), 'MR 기반 변경사항');
    await user.type(screen.getByLabelText(/사용자용 설명/), 'MR 기반 사용자 설명');
    await user.click(screen.getByRole('button', { name: '저장' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          ticketNumber: '!88',
          gitlabIssueUrl: '',
          gitlabMergeRequestUrl: 'https://gitlab.example.com/project/-/merge_requests/88',
        }),
      );
    });
  });

  it('검증 에러 표시 후 GitLab Issue를 선택하면 자동 채움 필드 에러가 해소된다', async () => {
    const user = userEvent.setup();
    render(
      <ReleaseItemForm releaseId="release-1" onSubmit={vi.fn()} onCancel={vi.fn()} />,
    );

    await user.click(screen.getByRole('button', { name: '저장' }));
    expect(await screen.findByText('이슈 번호를 입력해주세요.')).toBeInTheDocument();
    expect(screen.getByText('제목을 입력해주세요.')).toBeInTheDocument();
    expect(screen.getByText('담당자를 입력해주세요.')).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('Issue 선택'), '1001');

    await waitFor(() => {
      expect(screen.queryByText('이슈 번호를 입력해주세요.')).not.toBeInTheDocument();
    });
    expect(screen.queryByText('제목을 입력해주세요.')).not.toBeInTheDocument();
    expect(screen.queryByText('담당자를 입력해주세요.')).not.toBeInTheDocument();
  });

  it('Issue와 MR 선택 상태는 마지막 선택 기준으로 동기화된다', async () => {
    const user = userEvent.setup();
    render(
      <ReleaseItemForm releaseId="release-1" onSubmit={vi.fn()} onCancel={vi.fn()} />,
    );

    const issueSelect = screen.getByLabelText('Issue 선택');
    const mrSelect = screen.getByLabelText('MR 선택');

    await user.selectOptions(issueSelect, '1001');
    expect(issueSelect).toHaveValue('1001');
    expect(mrSelect).toHaveValue('');

    await user.selectOptions(mrSelect, '2001');

    expect(issueSelect).toHaveValue('');
    expect(mrSelect).toHaveValue('2001');
  });

  it('필수 필드가 비어 있으면 검증 메시지가 표시되고 onSubmit이 호출되지 않는다', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <ReleaseItemForm releaseId="release-1" onSubmit={onSubmit} onCancel={vi.fn()} />,
    );

    await user.click(screen.getByRole('button', { name: '저장' }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(await screen.findByText('이슈 번호를 입력해주세요.')).toBeInTheDocument();
    expect(screen.getByText('제목을 입력해주세요.')).toBeInTheDocument();
    expect(screen.getByText('담당자를 입력해주세요.')).toBeInTheDocument();
    expect(screen.getByText('CHANGELOG 요약을 입력해주세요.')).toBeInTheDocument();
    expect(screen.getByText('사용자용 설명을 입력해주세요.')).toBeInTheDocument();
  });

  it('정상 제출 시 onSubmit이 releaseId와 입력값을 포함한 ReleaseItem으로 호출된다', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <ReleaseItemForm releaseId="release-1" onSubmit={onSubmit} onCancel={vi.fn()} />,
    );

    await user.type(screen.getByLabelText(/이슈 번호/), '#123');
    await user.type(screen.getByLabelText(/제목/), '신규 기능 추가');
    await user.type(screen.getByLabelText(/담당자/), '홍길동');
    await user.type(screen.getByLabelText(/CHANGELOG 요약/), '신규 기능 요약');
    await user.type(screen.getByLabelText(/사용자용 설명/), '사용자 설명 내용');

    await user.click(screen.getByRole('button', { name: '저장' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          releaseId: 'release-1',
          ticketNumber: '#123',
          title: '신규 기능 추가',
          assigneeName: '홍길동',
          changelogSummary: '신규 기능 요약',
          userDescription: '사용자 설명 내용',
          testCases: [],
        }),
      );
    });
  });

  it('테스트 시나리오와 기대 결과 모두 입력 시 testCases가 1개 생성된다', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <ReleaseItemForm releaseId="release-1" onSubmit={onSubmit} onCancel={vi.fn()} />,
    );

    await user.type(screen.getByLabelText(/이슈 번호/), '#999');
    await user.type(screen.getByLabelText(/제목/), 'TC 테스트');
    await user.type(screen.getByLabelText(/담당자/), '테스터');
    await user.type(screen.getByLabelText(/CHANGELOG 요약/), '요약');
    await user.type(screen.getByLabelText(/사용자용 설명/), '설명');
    await user.type(screen.getByLabelText(/테스트 시나리오/), '로그인 시도');
    await user.type(screen.getByLabelText(/기대 결과/), '로그인 성공');

    await user.click(screen.getByRole('button', { name: '저장' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          testCases: [
            expect.objectContaining({
              description: '로그인 시도',
              expectedResult: '로그인 성공',
              status: 'NOT_STARTED',
            }),
          ],
        }),
      );
    });
  });

  it('취소 버튼 클릭 시 onCancel이 호출된다', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(
      <ReleaseItemForm releaseId="release-1" onSubmit={vi.fn()} onCancel={onCancel} />,
    );

    await user.click(screen.getByRole('button', { name: '취소' }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
