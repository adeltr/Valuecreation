// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeAll, beforeEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, within } from '@testing-library/react';
import { App } from './App';
import { initialState, reducer } from './state/store';
import { toDossier } from '../dossier/format';

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

  it('wine-spirits uses its level-2 template; no empty generic group in the picker', () => {
    render(<App />);
    expect(screen.queryByRole('group', { name: 'Modèle EBITDA générique' })).toBeNull();
    fireEvent.change(screen.getByLabelText(/Type d'entreprise/), { target: { value: 'wine-spirits' } });
    const company = screen.getByRole('region', { name: 'Entreprise' });
    expect(within(company).getByLabelText('EXCISE_TAX_RATE')).toBeTruthy();
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

describe('App – dossiers', () => {
  beforeEach(() => localStorage.clear());

  const bar = () => within(screen.getByRole('region', { name: 'Dossier' }));
  const typeSelect = () => screen.getByLabelText(/Type d'entreprise/) as HTMLSelectElement;
  const loadFactor = () => within(screen.getByRole('region', { name: 'Entreprise' })).getByLabelText('LOAD_FACTOR') as HTMLInputElement;
  const importFile = (content: string) => fireEvent.change(bar().getByLabelText(/Importer/), {
    target: { files: [new File([content], 'dossier.json', { type: 'application/json' })] },
  });

  it('saves a named case in the browser and reopens it later', () => {
    render(<App />);
    fireEvent.change(bar().getByLabelText('Nom du dossier'), { target: { value: 'Air X' } });
    fireEvent.change(loadFactor(), { target: { value: '0.7' } });
    fireEvent.click(bar().getByRole('button', { name: 'Enregistrer' }));
    expect(bar().getByText(/Enregistré/)).toBeTruthy();

    fireEvent.change(typeSelect(), { target: { value: 'cpg' } });
    expect((bar().getByLabelText('Nom du dossier') as HTMLInputElement).value).toBe('');

    fireEvent.change(bar().getByLabelText('Dossiers enregistrés'), { target: { value: 'Air X' } });
    fireEvent.click(bar().getByRole('button', { name: 'Ouvrir' }));
    expect(typeSelect().value).toBe('airline');
    expect(loadFactor().value).toBe('0.7');
    expect((bar().getByLabelText('Nom du dossier') as HTMLInputElement).value).toBe('Air X');
  });

  it('asks before replacing unsaved work, and keeps it on cancel', () => {
    render(<App />);
    fireEvent.change(bar().getByLabelText('Nom du dossier'), { target: { value: 'Air X' } });
    fireEvent.click(bar().getByRole('button', { name: 'Enregistrer' }));
    fireEvent.change(loadFactor(), { target: { value: '0.6' } });
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    fireEvent.change(bar().getByLabelText('Dossiers enregistrés'), { target: { value: 'Air X' } });
    fireEvent.click(bar().getByRole('button', { name: 'Ouvrir' }));
    expect(confirm).toHaveBeenCalledWith(expect.stringMatching(/non enregistrées/));
    expect(loadFactor().value).toBe('0.6');
    vi.restoreAllMocks();
  });

  it('switching company type also asks before discarding unsaved work', () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    render(<App />);
    fireEvent.change(loadFactor(), { target: { value: '0.6' } });
    fireEvent.change(typeSelect(), { target: { value: 'cpg' } });
    expect(confirm).toHaveBeenCalled();
    expect(typeSelect().value).toBe('airline');
    vi.restoreAllMocks();
  });

  it('does not ask when the current case is saved', () => {
    const confirm = vi.spyOn(window, 'confirm');
    render(<App />);
    fireEvent.change(bar().getByLabelText('Nom du dossier'), { target: { value: 'Air X' } });
    fireEvent.click(bar().getByRole('button', { name: 'Enregistrer' }));
    fireEvent.change(bar().getByLabelText('Dossiers enregistrés'), { target: { value: 'Air X' } });
    fireEvent.click(bar().getByRole('button', { name: 'Ouvrir' }));
    expect(confirm).not.toHaveBeenCalled();
    vi.restoreAllMocks();
  });

  it('refuses to save a case without a name', () => {
    render(<App />);
    fireEvent.click(bar().getByRole('button', { name: 'Enregistrer' }));
    expect(screen.getByRole('alert').textContent).toMatch(/nom/i);
    expect(localStorage.length).toBe(0);
  });

  it('deletes a saved dossier after confirmation', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<App />);
    fireEvent.change(bar().getByLabelText('Nom du dossier'), { target: { value: 'Air X' } });
    fireEvent.click(bar().getByRole('button', { name: 'Enregistrer' }));
    fireEvent.change(bar().getByLabelText('Dossiers enregistrés'), { target: { value: 'Air X' } });
    fireEvent.click(bar().getByRole('button', { name: 'Supprimer' }));
    expect(bar().queryByRole('option', { name: /Air X/ })).toBeNull();
    vi.restoreAllMocks();
  });

  it('exports the case as a JSON dossier file', async () => {
    let blob: Blob | null = null;
    URL.createObjectURL = vi.fn((b: Blob) => { blob = b; return 'blob:x'; });
    URL.revokeObjectURL = vi.fn();
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    render(<App />);
    fireEvent.click(bar().getByRole('button', { name: 'Exporter' }));
    expect(screen.getByRole('alert').textContent).toMatch(/nom/i);
    fireEvent.change(bar().getByLabelText('Nom du dossier'), { target: { value: 'Air X' } });
    fireEvent.click(bar().getByRole('button', { name: 'Exporter' }));
    const text = await new Promise<string>((resolve) => {
      const r = new FileReader(); r.onload = () => resolve(String(r.result)); r.readAsText(blob!);
    });
    const file = JSON.parse(text);
    expect(file).toMatchObject({ format: 'value-cockpit-dossier', name: 'Air X', archetype: 'airline' });
    expect(screen.queryByRole('alert')).toBeNull();
    vi.restoreAllMocks();
  });

  it('imports a dossier file', async () => {
    const saved = reducer(reducer(initialState('cpg'), { type: 'setName', name: 'Brand Co' }), { type: 'setInput', code: 'GROSS_MARGIN', value: 0.5 });
    render(<App />);
    importFile(JSON.stringify(toDossier(saved, 't')));
    expect(await bar().findByDisplayValue('Brand Co')).toBeTruthy();
    expect(typeSelect().value).toBe('cpg');
  });

  it('refuses an invalid dossier file and keeps the current case', async () => {
    render(<App />);
    importFile('{"format":"nope"}');
    expect((await screen.findByRole('alert')).textContent).toMatch(/Dossier refusé/);
    expect(typeSelect().value).toBe('airline');
  });
});

