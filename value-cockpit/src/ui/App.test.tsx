// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeAll, beforeEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, within, waitFor } from '@testing-library/react';
import { App } from './App';
import { renderPlanSlide } from './export/planSlide';

vi.mock('./export/planSlide', async (orig) => ({
  ...(await orig<typeof import('./export/planSlide')>()),
  renderPlanSlide: vi.fn(async () => null),
}));
import { initialState, reducer } from './state/store';
import { toDossier } from '../dossier/format';
import { getCatalog } from '../catalog';
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
    expect(within(plan).getAllByText('Renouvellement de flotte').length).toBeGreaterThan(0);
    expect(within(plan).getAllByText(/airline-10/).length).toBeGreaterThan(0);
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

  it('a lever card explains the lever: path to the MOIC, sensitivity, impact after validation, analyses', () => {
    render(<App />);
    const copilot = screen.getByRole('region', { name: 'Copilote' });
    fireEvent.change(within(copilot).getByLabelText(/Réponse JSON/), { target: { value: proposal } });
    fireEvent.click(within(copilot).getByRole('button', { name: 'Ingérer' }));
    expect(screen.queryByRole('region', { name: 'Fiche levier' })).toBeNull();
    fireEvent.click(within(copilot).getByRole('button', { name: /Fiche/ }));

    const card = screen.getByRole('region', { name: 'Fiche levier' });
    expect(within(card).getByText(/FUEL_CASK → OPERATING_COSTS_EXIT → EBITDA_EXIT → EQUITY_EXIT → MOIC/)).toBeTruthy();
    expect(within(card).getByText(/Sensibilité du modèle/)).toBeTruthy();
    expect(within(card).getByText(/après validation/)).toBeTruthy();
    expect(within(card).getByText('Fuel Efficiency per Aircraft Type Analysis')).toBeTruthy();

    fireEvent.click(within(copilot).getByRole('button', { name: /Valider/ }));
    expect(within(card).getByText(/Impact du levier/)).toBeTruthy();
    fireEvent.click(within(card).getByRole('button', { name: 'Fermer' }));
    expect(screen.queryByRole('region', { name: 'Fiche levier' })).toBeNull();
  });

  it('the 100-day plan: phased workstream with engine value, editable owner and status, foundations, slide export', async () => {
    render(<App />);
    const copilot = screen.getByRole('region', { name: 'Copilote' });
    fireEvent.change(within(copilot).getByLabelText(/Réponse JSON/), { target: { value: proposal } });
    fireEvent.click(within(copilot).getByRole('button', { name: 'Ingérer' }));
    const plan = screen.getByRole('region', { name: 'Plan 100 jours' });
    expect(within(plan).queryByText('Renouvellement de flotte')).toBeNull(); // hypotheses stay out of the plan
    expect(within(plan).getByText('Gouvernance et PMO')).toBeTruthy();

    fireEvent.click(within(copilot).getByRole('button', { name: /Valider/ }));
    expect(within(plan).getAllByText('Renouvellement de flotte').length).toBeGreaterThan(0);
    expect(within(plan).getByText(/captés d'ici J100/)).toBeTruthy();
    expect(within(plan).getByText(/Premier impact mesuré sur FUEL_CASK/)).toBeTruthy();

    const owner = within(plan).getByLabelText('Responsable — Renouvellement de flotte') as HTMLInputElement;
    fireEvent.change(owner, { target: { value: 'Directeur des opérations' } });
    expect(owner.value).toBe('Directeur des opérations');
    const status = within(plan).getByLabelText('Statut — Renouvellement de flotte') as HTMLSelectElement;
    fireEvent.change(status, { target: { value: 'in_progress' } });
    expect(status.value).toBe('in_progress');

    fireEvent.click(within(plan).getByRole('button', { name: /Exporter le slide/ }));
    await waitFor(() => expect(renderPlanSlide).toHaveBeenCalled());
    const [model, output] = vi.mocked(renderPlanSlide).mock.calls[0];
    expect(output).toBe('download');
    expect(model.title).toMatch(/^Plan 100 jours : 1 chantier pour porter le MOIC/);
    expect(model.table[1].slice(0, 2)).toEqual(['Renouvellement de flotte', 'Directeur des opérations']);
  });

  it('an input the engine cannot compute (division by zero) shows an error instead of crashing', () => {
    render(<App />);
    const company = screen.getByRole('region', { name: 'Entreprise' });
    const copilot = screen.getByRole('region', { name: 'Copilote' });
    fireEvent.change(within(copilot).getByLabelText(/Réponse JSON/), { target: { value: proposal } });
    fireEvent.click(within(copilot).getByRole('button', { name: 'Ingérer' }));
    fireEvent.click(within(copilot).getByRole('button', { name: /Fiche/ }));
    fireEvent.change(within(company).getByLabelText('AVG_TRIP_KM'), { target: { value: '0' } });
    expect(screen.getByRole('region', { name: 'Plan 100 jours' })).toBeTruthy();
    expect(within(screen.getByRole('region', { name: 'Fiche levier' })).getByText(/finite number/)).toBeTruthy();
    expect(screen.getAllByText(/finite number/).length).toBeGreaterThan(0);
  });

  it('workshop: run an analysis formula on company data, record it, apply it to the model', () => {
    render(<App />);
    const lf = getCatalog('airline').find((a) => a.formulas.some((f) => f.output === 'Load Factor'))!;
    const vars = lf.formulas.find((f) => f.output === 'Load Factor')!.variables;
    const ws = screen.getByRole('region', { name: 'Atelier d\'analyse' });
    fireEvent.change(within(ws).getByLabelText('Analyse à mener'), { target: { value: lf.id } });
    expect(within(ws).getByText(lf.goal)).toBeTruthy();

    const calc = within(ws).getByRole('group', { name: 'Load Factor' });
    fireEvent.change(within(calc).getByLabelText(vars[0]), { target: { value: '78' } });
    fireEvent.change(within(calc).getByLabelText(vars[1]), { target: { value: '100' } });
    expect(within(calc).getByTestId('result').textContent).toMatch(/78/);
    expect((within(calc).getByLabelText('Métrique mesurée') as HTMLSelectElement).value).toBe('LOAD_FACTOR');
    fireEvent.click(within(calc).getByRole('button', { name: 'Enregistrer l\'observation' }));

    const list = within(ws).getByRole('list', { name: 'Observations' });
    expect(within(list).getByText(/LOAD_FACTOR/)).toBeTruthy();
    fireEvent.click(within(list).getByRole('button', { name: /Appliquer à l'entreprise/ }));
    const company = screen.getByRole('region', { name: 'Entreprise' });
    expect((within(company).getByLabelText('LOAD_FACTOR') as HTMLInputElement).value).toBe('0.78');
    expect(within(list).getByText(/appliquée/)).toBeTruthy();

    const copilot = screen.getByRole('region', { name: 'Copilote' });
    fireEvent.change(within(copilot).getByLabelText(/Réponse JSON/), { target: { value: proposal.replace(/FUEL_CASK/g, 'LOAD_FACTOR').replace('FUEL_EFFICIENCY', 'NETWORK_OPTIMIZATION') } });
    fireEvent.click(within(copilot).getByRole('button', { name: 'Ingérer' }));
    fireEvent.click(within(copilot).getByRole('button', { name: /Fiche/ }));
    const card = screen.getByRole('region', { name: 'Fiche levier' });
    expect(within(card).getByText(/Mesures de l'atelier sur LOAD_FACTOR/)).toBeTruthy();
    expect(within(card).getByText(/78,0 %.*appliquée au modèle/)).toBeTruthy();
  });

  it('the lever card opens its analyses in the workshop', () => {
    render(<App />);
    const copilot = screen.getByRole('region', { name: 'Copilote' });
    fireEvent.change(within(copilot).getByLabelText(/Réponse JSON/), { target: { value: proposal } });
    fireEvent.click(within(copilot).getByRole('button', { name: 'Ingérer' }));
    fireEvent.click(within(copilot).getByRole('button', { name: /Fiche/ }));
    const card = screen.getByRole('region', { name: 'Fiche levier' });
    fireEvent.click(within(card).getAllByRole('button', { name: /Ouvrir dans l'atelier/ })[0]);
    const ws = screen.getByRole('region', { name: 'Atelier d\'analyse' });
    expect((within(ws).getByLabelText('Analyse à mener') as HTMLSelectElement).value).toMatch(/^airline-\d\d$/);
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
