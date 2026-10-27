// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import { render, screen, cleanup, fireEvent, within } from '@testing-library/react';
import { App } from './App';

beforeAll(() => {
  // React Flow measures its container.
  globalThis.ResizeObserver ??= class { observe() {} unobserve() {} disconnect() {} } as never;
});
afterEach(cleanup);

const proposal = JSON.stringify({
  levers: [{
    nodeId: 'FUEL_CASK', causeId: null, label: 'Renouvellement de flotte', mechanism: 'avions moins gourmands',
    category: 'FUEL_EFFICIENCY', impactMetricCode: 'FUEL_CASK', expectedDelta: -0.002, deltaKind: 'absolute',
    timeToImpactDays: 60, effort: 'high', confidence: 0.5, confidenceBasis: 'cf. airline-10',
  }],
});

const moic = () => within(screen.getByRole('region', { name: 'Simulation' })).getByTestId('moic-scenario').textContent;

describe('App', () => {
  it('renders the title and the 3+1 panels', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toMatch(/Value Creation Cockpit/);
    for (const name of ['Arbre de valeur', 'Entreprise', 'Copilote', 'Simulation', 'Plan 100 jours']) {
      expect(screen.getByRole('region', { name })).toBeTruthy();
    }
  });

  it('a copilot hypothesis cannot be simulated until the analyst validates it', () => {
    render(<App />);
    const copilot = screen.getByRole('region', { name: 'Copilote' });
    fireEvent.change(within(copilot).getByLabelText(/Réponse JSON/), { target: { value: proposal } });
    fireEvent.click(within(copilot).getByRole('button', { name: /Ingérer/ }));
    expect(within(copilot).getByText('hypothèse')).toBeTruthy();
    expect(within(copilot).getByText(/cf\. airline-10/)).toBeTruthy();

    const sim = screen.getByRole('region', { name: 'Simulation' });
    const box = within(sim).getByRole('checkbox', { name: /Renouvellement de flotte/ }) as HTMLInputElement;
    expect(box.disabled).toBe(true);
    const before = moic();

    fireEvent.click(within(copilot).getByRole('button', { name: /Valider/ }));
    expect(box.disabled).toBe(false);
    fireEvent.click(box);
    expect(moic()).not.toBe(before);
    expect(within(sim).getByText(/calculés par le moteur/)).toBeTruthy();
    expect(within(sim).getByText(/additifs/)).toBeTruthy();

    const plan = screen.getByRole('region', { name: 'Plan 100 jours' });
    expect(within(plan).getByText(/Renouvellement de flotte/)).toBeTruthy();
    expect(within(plan).getByText(/airline-33/)).toBeTruthy();
  });

  it('an out-of-vocabulary proposal is rejected with a visible error', () => {
    render(<App />);
    const copilot = screen.getByRole('region', { name: 'Copilote' });
    fireEvent.change(within(copilot).getByLabelText(/Réponse JSON/), {
      target: { value: proposal.replace('FUEL_EFFICIENCY', 'MULTIPLE_EXPANSION') },
    });
    fireEvent.click(within(copilot).getByRole('button', { name: /Ingérer/ }));
    expect(screen.getByRole('alert').textContent).toMatch(/rejetée/);
  });

  it('switching archetype re-instantiates the template', () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Type d'entreprise/), { target: { value: 'aero' } });
    const company = screen.getByRole('region', { name: 'Entreprise' });
    expect(within(company).getByLabelText('BOOK_TO_BILL')).toBeTruthy();
  });

  it('a level-1 company type uses the generic EBITDA template', () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Type d'entreprise/), { target: { value: 'wine-spirits' } });
    const company = screen.getByRole('region', { name: 'Entreprise' });
    expect(within(company).getByLabelText('REVENUE_GROWTH')).toBeTruthy();
    expect(within(screen.getByRole('region', { name: 'Simulation' })).getByTestId('moic-scenario').textContent).toMatch(/x$/);
  });

  it('cpg uses its level-2 template (volume × price-mix, gross-to-net margin)', () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Type d'entreprise/), { target: { value: 'cpg' } });
    const company = screen.getByRole('region', { name: 'Entreprise' });
    expect(within(company).getByLabelText('TRADE_SPEND_RATE')).toBeTruthy();
  });

  it('exploration: clicking a driver lists the analyses to run', () => {
    render(<App />);
    const graph = screen.getByRole('region', { name: 'Arbre de valeur' });
    fireEvent.click(within(graph).getByRole('button', { name: 'Explorer LOAD_FACTOR' }));
    expect(within(graph).getByText(/airline-13/)).toBeTruthy();
  });
});
