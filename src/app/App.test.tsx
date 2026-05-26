import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';

describe('App', () => {
  beforeEach(() => {
    window.location.hash = '';
  });

  it('renders app header with title', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: 'ReleaseHub' })).toBeInTheDocument();
  });

  it('shows release list on initial load', () => {
    render(<App />);
    expect(screen.getByText('v1.8.0')).toBeInTheDocument();
    expect(screen.getByText('v1.9.0')).toBeInTheDocument();
  });

  it('QC 상태 변경 결과를 상세 요약과 목록 진행률에 반영한다', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'v1.8.0' }));
    await screen.findByText('v1.8.0 릴리즈');
    await user.click(screen.getByRole('tab', { name: 'QC Checklist' }));

    await user.selectOptions(
      screen.getByLabelText('상태 변경: 기간 필터 적용 확인'),
      'PASSED',
    );

    expect(screen.getByText('Passed 3')).toBeInTheDocument();
    expect(screen.getByText('Not Started 1')).toBeInTheDocument();

    await user.selectOptions(
      screen.getByLabelText('상태 변경: 기간 필터 초기화 확인'),
      'FAILED',
    );
    await user.type(
      screen.getByLabelText('실패/차단 사유: 기간 필터 초기화 확인'),
      '기간 초기화 API 응답 지연',
    );

    expect(screen.getByLabelText('실패/차단 사유: 기간 필터 초기화 확인')).toHaveValue(
      '기간 초기화 API 응답 지연',
    );
    expect(screen.getByText('Failed 1')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'ReleaseHub' }));

    expect(screen.getByText('3/4')).toBeInTheDocument();
  });
});
