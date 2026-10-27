// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeAll, beforeEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, within, waitFor } from '@testing-library/react';
import { App } from './App';
import { initialState, reducer } from './state/store';
import { toDossier } from '../dossier/format';
import { LocalDossierRepository, type KeyValueStore } from './state/library';
import type { DossierRepository } from '../dossier/repository';

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
    expect(within(sim).getByText(/se composent/)).toBeTruthy();
    expect(within(sim).queryByText(/Interactions/)).toBeNull(); // airline has no interaction rule

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

  it('the simulation lists the interaction rules of the template', () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Type d'entreprise/), { target: { value: 'cpg' } });
    const sim = screen.getByRole('region', { name: 'Simulation' });
    expect(within(sim).getByText(/Interactions/)).toBeTruthy();
    expect(within(sim).getByText(/PRICE_MIX_GROWTH → VOLUME_GROWTH/)).toBeTruthy();
    expect(within(sim).getByText(/PRICE_ELASTICITY = -0,8/)).toBeTruthy();
  });

  it('a bank is valued on book value: P/BV exit multiple, book-value bridge rows', () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Type d'entreprise/), { target: { value: 'commercial-bank' } });
    const sim = screen.getByRole('region', { name: 'Simulation' });
    expect(within(sim).getByLabelText(/Multiple de sortie \(P\/BV/)).toBeTruthy();
    expect(within(sim).getByText('BOOK_VALUE_EXIT')).toBeTruthy();
    expect(within(sim).queryByText('EBITDA_EXIT')).toBeNull();
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
  const memory = (): KeyValueStore => { const m = new Map<string, string>(); return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => { m.set(k, v); } }; };
  let repo: DossierRepository;
  beforeEach(() => { repo = new LocalDossierRepository(memory()); });
  afterEach(() => vi.restoreAllMocks());

  /** Renders the app on `repo` and waits until the dossier bar is connected. */
  const start = async (where: 'server' | 'browser' = 'browser') => {
    render(<App connect={async () => ({ repo, where })} />);
    await screen.findByText(where === 'server' ? /serveur partagé/ : /ce navigateur/);
  };
  const bar = () => within(screen.getByRole('region', { name: 'Dossier' }));
  const typeSelect = () => screen.getByLabelText(/Type d'entreprise/) as HTMLSelectElement;
  const nameInput = () => bar().getByLabelText('Nom du dossier') as HTMLInputElement;
  const loadFactor = () => within(screen.getByRole('region', { name: 'Entreprise' })).getByLabelText('LOAD_FACTOR') as HTMLInputElement;
  const click = (name: string) => fireEvent.click(bar().getByRole('button', { name }));
  const saveAs = async (name: string) => {
    fireEvent.change(nameInput(), { target: { value: name } });
    click('Enregistrer');
    await bar().findByText(/Enregistré/);
  };
  const choose = async (name: string) => {
    await bar().findByRole('option', { name: new RegExp(name) });
    fireEvent.change(bar().getByLabelText('Dossiers enregistrés'), { target: { value: name } });
  };
  const importFile = (content: string) => fireEvent.change(bar().getByLabelText(/Importer/), {
    target: { files: [new File([content], 'dossier.json', { type: 'application/json' })] },
  });

  it('shows where dossiers are kept', async () => {
    await start('server');
    expect(bar().getByText(/serveur partagé/)).toBeTruthy();
  });

  it('saves a named case and reopens it later', async () => {
    await start();
    fireEvent.change(loadFactor(), { target: { value: '0.7' } });
    await saveAs('Air X');
    fireEvent.change(typeSelect(), { target: { value: 'cpg' } });
    expect(nameInput().value).toBe('');
    await choose('Air X');
    click('Ouvrir');
    await waitFor(() => expect(typeSelect().value).toBe('airline'));
    expect(loadFactor().value).toBe('0.7');
    expect(nameInput().value).toBe('Air X');
  });

  it('saving again updates the same dossier (next revision)', async () => {
    await start();
    await saveAs('Air X');
    fireEvent.change(loadFactor(), { target: { value: '0.7' } });
    click('Enregistrer');
    await waitFor(async () => expect((await repo.read('Air X')).revision).toBe(2));
  });

  it('someone else saved meanwhile: asks before overwriting, keeps their version on cancel', async () => {
    await start('server');
    await saveAs('Air X');
    const theirs = await repo.read('Air X');
    await repo.save({ ...theirs.file, savedAt: 'later' }, 1);   // another analyst
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    fireEvent.change(loadFactor(), { target: { value: '0.6' } });
    click('Enregistrer');
    await waitFor(() => expect(confirm).toHaveBeenCalledWith(expect.stringMatching(/modifié depuis son ouverture/)));
    expect((await repo.read('Air X')).revision).toBe(2);
    expect(screen.getByRole('alert').textContent).toMatch(/pas été enregistré/);
    expect(bar().queryByRole('status')).toBeNull();
  });

  it('saving a new case under an existing name asks before replacing it', async () => {
    await start();
    await saveAs('Air X');
    fireEvent.change(typeSelect(), { target: { value: 'cpg' } });
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
    await saveAs('Air X');
    expect(confirm).toHaveBeenCalledWith(expect.stringMatching(/existe déjà/));
    expect((await repo.read('Air X')).file.archetype).toBe('cpg');
  });

  it('asks before replacing unsaved work, and keeps it on cancel', async () => {
    await start();
    await saveAs('Air X');
    fireEvent.change(loadFactor(), { target: { value: '0.6' } });
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    await choose('Air X');
    click('Ouvrir');
    expect(confirm).toHaveBeenCalledWith(expect.stringMatching(/non enregistrées/));
    expect(loadFactor().value).toBe('0.6');
  });

  it('switching company type also asks before discarding unsaved work', async () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    await start();
    fireEvent.change(loadFactor(), { target: { value: '0.6' } });
    fireEvent.change(typeSelect(), { target: { value: 'cpg' } });
    expect(confirm).toHaveBeenCalled();
    expect(typeSelect().value).toBe('airline');
  });

  it('does not ask when the current case is saved', async () => {
    const confirm = vi.spyOn(window, 'confirm');
    await start();
    await saveAs('Air X');
    await choose('Air X');
    click('Ouvrir');
    await waitFor(() => expect(nameInput().value).toBe('Air X'));
    expect(confirm).not.toHaveBeenCalled();
  });

  it('refuses to save a case without a name', async () => {
    await start();
    click('Enregistrer');
    expect((await screen.findByRole('alert')).textContent).toMatch(/nom/i);
    expect(await repo.list()).toEqual([]);
  });

  it('deletes a saved dossier after confirmation', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    await start();
    await saveAs('Air X');
    await choose('Air X');
    click('Supprimer');
    await waitFor(() => expect(bar().queryByRole('option', { name: /Air X/ })).toBeNull());
    expect(await repo.list()).toEqual([]);
  });

  it('exports the case as a JSON dossier file', async () => {
    let blob: Blob | null = null;
    URL.createObjectURL = vi.fn((b: Blob) => { blob = b; return 'blob:x'; });
    URL.revokeObjectURL = vi.fn();
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    await start();
    click('Exporter');
    expect(screen.getByRole('alert').textContent).toMatch(/nom/i);
    fireEvent.change(nameInput(), { target: { value: 'Air X' } });
    click('Exporter');
    const text = await new Promise<string>((resolve) => {
      const r = new FileReader(); r.onload = () => resolve(String(r.result)); r.readAsText(blob!);
    });
    expect(JSON.parse(text)).toMatchObject({ format: 'value-cockpit-dossier', name: 'Air X', archetype: 'airline' });
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('imports a dossier file', async () => {
    const saved = reducer(reducer(initialState('cpg'), { type: 'setName', name: 'Brand Co' }), { type: 'setInput', code: 'GROSS_MARGIN', value: 0.5 });
    await start();
    importFile(JSON.stringify(toDossier(saved, 't')));
    expect(await bar().findByDisplayValue('Brand Co')).toBeTruthy();
    expect(typeSelect().value).toBe('cpg');
  });

  it('refuses an invalid dossier file and keeps the current case', async () => {
    await start();
    importFile('{"format":"nope"}');
    expect((await screen.findByRole('alert')).textContent).toMatch(/Dossier refusé/);
    expect(typeSelect().value).toBe('airline');
  });
});
