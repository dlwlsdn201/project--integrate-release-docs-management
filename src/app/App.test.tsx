import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('renders app header with title', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: 'ReleaseHub' })).toBeInTheDocument();
  });

  it('shows release list on initial load', () => {
    render(<App />);
    expect(screen.getByText('v1.8.0')).toBeInTheDocument();
    expect(screen.getByText('v1.9.0')).toBeInTheDocument();
  });
});
