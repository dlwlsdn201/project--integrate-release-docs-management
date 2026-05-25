import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('renders without error and shows expected content', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'ReleaseHub' })).toBeInTheDocument();
    expect(
      screen.getByText('GitLab 릴리즈 정보를 하나의 원본 데이터로 관리합니다'),
    ).toBeInTheDocument();
  });
});
