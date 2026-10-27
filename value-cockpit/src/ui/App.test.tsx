// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { App } from './App';

afterEach(cleanup);

describe('App shell', () => {
  it('renders the cockpit title', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toMatch(/Value Creation Cockpit/);
  });
});
