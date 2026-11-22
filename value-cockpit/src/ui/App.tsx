import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { initialState, reducer, selectBaseline, selectMetrics, selectScenario } from './state/store';
import { TEMPLATES } from '../templates';
import { getCatalog } from '../catalog';
import { getActiveVocabulary, getBridgeFamily, type SectorArchetype } from '../ontology/registry';
import { FAMILY_BRIDGE } from '../templates/build';
import { DriverGraph } from './components/DriverGraph';
import { CompanyView } from './components/CompanyView';
import { CopilotPanel } from './components/CopilotPanel';
import { SimulationPanel } from './components/SimulationPanel';
import { PlanPanel } from './components/PlanPanel';
import { buildPlan } from './model/plan';
import { buildSlideModel, renderPlanSlide } from './export/planSlide';
import { DossierBar, type SavedRef } from './components/DossierBar';
import { LeverCardPanel } from './components/LeverCardPanel';
import { WorkshopPanel } from './components/WorkshopPanel';
import { EmpiricalPanel } from './components/EmpiricalPanel';
import { impliedTrajectory } from '../empirical/realism';
import { entryChecks } from './model/entryChecks';
import { reliability } from './state/provenance';
import { toDossier } from '../dossier/format';
import type { DossierRepository } from '../dossier/repository';
import { connectRepository, type DossierLocation } from './state/httpRepository';
import { hasUnsavedWork } from './state/unsaved';
import { formatValue } from './model/format';
import { Icon } from './components/Icon';
import { authFetch, loadSession, saveAnalyst, savePassword, type Session } from './state/session';

type StepId = 'data' | 'diagnostic' | 'levers' | 'value' | 'plan';
/** The order of the work (PRODUCT.md): one step on screen at a time. */
const STEPS: { id: StepId; label: string; title: string; lead: string }[] = [
  { id: 'data', label: 'Données', title: "Données de l'entreprise",
    lead: "Renseignez les drivers du secteur et la structure du deal. Chaque valeur garde sa source ; une valeur de démo reste signalée tant que vous ne l'avez ni remplacée ni confirmée." },
  { id: 'diagnostic', label: 'Diagnostic', title: 'Diagnostic',
    lead: "Suivez comment chaque driver opérationnel remonte jusqu'au MOIC, puis mesurez-le sur les données de l'entreprise avec les analyses du catalogue." },
  { id: 'levers', label: 'Leviers', title: 'Leviers de création de valeur',
    lead: 'Le copilote propose des causes et des leviers, jamais de chiffres. Vous validez ou rejetez chaque levier ; seuls les leviers validés entrent dans la simulation.' },
  { id: 'value', label: 'Valeur', title: 'Valeur créée',
    lead: 'Le moteur calcule le bridge, le MOIC et le TRI avec les leviers validés. Comparez des scénarios, puis confrontez le plan aux sociétés cotées comparables.' },
  { id: 'plan', label: 'Plan 100 jours', title: 'Plan 100 jours',
    lead: 'Chaque levier validé devient un chantier phasé sur 100 jours, avec sa valeur calculée par le moteur, ses KPI et ses jalons.' },
];
const plural = (n: number, word: string) => `${n} ${word}${n > 1 ? 's' : ''}`;

type Connect = (fetchImpl: typeof fetch) => Promise<{ repo: DossierRepository; where: DossierLocation }>;
const defaultConnect: Connect = (fetchImpl) => connectRepository(fetchImpl, window.localStorage);

export function App({ connect = defaultConnect }: { connect?: Connect } = {}) {
  const [state, dispatch] = useReducer(reducer, 'airline' as SectorArchetype, initialState);
  // Who is working, and the team's shared password: every server call carries both (docs/22).
  const [session, setSession] = useState<Session>(loadSession);
  const [passwordDraft, setPasswordDraft] = useState('');
  const sessionRef = useRef(session);
  sessionRef.current = session;
  const api = useMemo(() => authFetch((...a) => fetch(...a), () => sessionRef.current), []);
  const metrics = useMemo(() => selectMetrics(state), [state]);
  const catalog = getCatalog(state.archetype);
  const [store, setStore] = useState<Awaited<ReturnType<Connect>> | null>(null);
  useEffect(() => {
    let live = true;
    void connect(api).then((s) => { if (live) setStore(s); });
    return () => { live = false; };
  }, [connect, api, session.password]);
  const [saved, setSaved] = useState<SavedRef | null>(null);
  const [cardLeverId, setCardLeverId] = useState<string | null>(null);
  const cardLever = state.levers.find((l) => l.id === cardLeverId);
  const [workshopId, setWorkshopId] = useState<string | null>(null);
  const [step, setStep] = useState<StepId>('data');
  // A step change moves focus to its title (as a page change would), not on first render.
  const stepTitles = useRef(new Map<StepId, HTMLHeadingElement>());
  const focusStep = useRef(false);
  useEffect(() => {
    if (!focusStep.current) return;
    focusStep.current = false;
    stepTitles.current.get(step)?.focus();
  }, [step]);
  const go = (id: StepId) => { focusStep.current = true; setStep(id); };
  const mayReplace = () => !hasUnsavedWork(state, saved?.fingerprint ?? null)
    || window.confirm('Les modifications non enregistrées du dossier en cours seront perdues. Continuer ?');

  // The engine may refuse an input set (e.g. a division by zero while typing): show it, never guess.
  let baseline = new Map<string, number>();
  let scenario = null;
  let plan = null;
  let trajectory = null;
  let engineError: string | null = null;
  try {
    baseline = selectBaseline(state);
    scenario = selectScenario(state);
    plan = buildPlan({
      levers: state.levers, rootCauses: state.rootCauses, metrics, catalog,
      rules: TEMPLATES[state.archetype]!.interactions, family: getBridgeFamily(state.archetype), overrides: state.plan,
    });
    trajectory = impliedTrajectory(metrics, state.levers, TEMPLATES[state.archetype]!.interactions);
  } catch (e) {
    engineError = (e as Error).message;
  }

  const rel = reliability(state);
  const validated = state.levers.filter((l) => l.status === 'validated').length;
  const pending = state.levers.filter((l) => l.status === 'hypothesis').length;
  const scenarioMoic = scenario?.find((r) => r.metricCode === 'MOIC')?.value;
  const status: Record<StepId, string> = {
    data: `${rel.sourced}/${rel.total} valeurs sourcées`,
    diagnostic: state.observations.length ? plural(state.observations.length, 'mesure') : 'aucune mesure',
    levers: state.levers.length === 0 ? 'aucun levier'
      : [validated && plural(validated, 'validé'), pending && `${pending} à décider`].filter(Boolean).join(' · ') || plural(state.levers.length, 'rejeté'),
    value: engineError ? 'calcul refusé' : `MOIC ${formatValue(scenarioMoic, 'ratio')}`,
    plan: !plan ? 'indisponible' : plan.workstreams.length ? plural(plan.workstreams.length, 'chantier') : 'aucun chantier',
  };
  const family = getBridgeFamily(state.archetype);
  const exportSlide = () => {
    if (!plan) return;
    const model = buildSlideModel(plan, {
      company: state.name, archetypeLabel: TEMPLATES[state.archetype]!.label, date: new Date().toLocaleDateString('fr-FR'), demoInputs: rel.demo.length,
    });
    const file = `${(state.name.trim() || 'plan').replace(/[\\/:*?"<>|]/g, '-')}-100-jours.pptx`;
    renderPlanSlide(model, 'download', file)
      .catch((e) => dispatch({ type: 'reportError', message: `Export du slide impossible : ${(e as Error).message}` }));
  };

  const content: Record<StepId, JSX.Element> = {
    data: (
      <CompanyView metrics={metrics} baseline={baseline} dispatch={dispatch} archetype={state.archetype}
        bridgeInputs={FAMILY_BRIDGE[family].inputs} context={state.context}
        checks={entryChecks(metrics, family)} provenance={state.provenance} analyst={session.analyst} fetchImpl={api} />
    ),
    diagnostic: (
      <>
        <DriverGraph metrics={metrics} baseline={baseline} catalog={catalog} archetype={state.archetype} visible={step === 'diagnostic'} />
        <WorkshopPanel state={state} metrics={metrics} catalog={catalog} vocab={getActiveVocabulary(state.archetype)}
          analysisId={workshopId} onSelect={setWorkshopId} dispatch={dispatch} />
      </>
    ),
    levers: (
      <div className={`levers-layout ${cardLever ? 'with-card' : ''}`}>
        <CopilotPanel archetype={state.archetype} levers={state.levers} rootCauses={state.rootCauses} dispatch={dispatch} onOpenCard={setCardLeverId}
          inputCodes={Object.keys(state.inputs)} analyst={session.analyst} fetchImpl={api}
          company={() => toDossier({ ...state, name: state.name.trim() || 'Dossier sans nom' }, new Date().toISOString())} />
        {cardLever && (
          <LeverCardPanel lever={cardLever} metrics={metrics} catalog={catalog}
            interactions={TEMPLATES[state.archetype]!.interactions} onClose={() => setCardLeverId(null)}
            observations={state.observations} onOpenAnalysis={(id) => { setWorkshopId(id); go('diagnostic'); }} />
        )}
      </div>
    ),
    value: (
      <>
        <SimulationPanel state={state} metrics={metrics} baseline={baseline} scenario={scenario} scenarioError={engineError} dispatch={dispatch}
          interactions={TEMPLATES[state.archetype]!.interactions}
          bridgeRows={FAMILY_BRIDGE[family].summaryRows}
          multipleLabel={FAMILY_BRIDGE[family].multipleLabel} archetype={state.archetype}
          demoInputs={rel.demo.length} />
        <EmpiricalPanel archetype={state.archetype} trajectory={trajectory} fetchImpl={api} />
      </>
    ),
    plan: <PlanPanel dispatch={dispatch} plan={plan} engineError={engineError} onExportSlide={exportSlide} />,
  };

  return (
    <div className="app">
      <aside className="rail">
        <h1 className="brand">Value Creation Cockpit</h1>
        <label className="rail-field">
          Type d'entreprise
          <select value={state.archetype}
            onChange={(e) => {
              if (!mayReplace()) return;
              setSaved(null);
              setCardLeverId(null);
              setWorkshopId(null);
              dispatch({ type: 'selectArchetype', archetype: e.target.value as SectorArchetype });
            }}>
            {([2, 1] as const).map((level) => {
              const entries = Object.entries(TEMPLATES).filter(([, t]) => t!.level === level);
              return entries.length === 0 ? null : (
                <optgroup key={level} label={level === 2 ? 'Modèle sectoriel complet' : 'Modèle EBITDA générique'}>
                  {entries.sort(([, a], [, b]) => a!.label.localeCompare(b!.label))
                    .map(([a, t]) => <option key={a} value={a}>{t!.label}</option>)}
                </optgroup>
              );
            })}
          </select>
        </label>
        <label className="rail-field">
          Analyste
          <input aria-label="Analyste" value={session.analyst} placeholder="Votre nom"
            onChange={(e) => { saveAnalyst(e.target.value); setSession({ ...session, analyst: e.target.value }); }} />
        </label>
        <nav aria-label="Étapes" className="steps-nav">
          <ol className="steps">
            {STEPS.map((s) => (
              <li key={s.id}>
                <button type="button" className="step-link" aria-current={step === s.id ? 'step' : undefined} onClick={() => go(s.id)}>
                  <span className="step-label">{s.label}</span>
                  <span className="sr-only">, </span>
                  <span className="step-status">{status[s.id]}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </aside>

      <div className="work">
        {store && <DossierBar state={state} dispatch={dispatch} repo={store.repo} where={store.where}
          mayReplace={mayReplace} saved={saved} onSaved={setSaved} analyst={session.analyst} />}
        {store?.where === 'locked' && (
          <form className="banner banner-warn" onSubmit={(e) => { e.preventDefault(); savePassword(passwordDraft); setSession({ ...session, password: passwordDraft }); }}>
            <Icon name="lock" />
            <span className="banner-text">Ce serveur demande le mot de passe partagé de l'équipe.{session.password && ' Le mot de passe saisi a été refusé.'}</span>
            <input aria-label="Mot de passe partagé" type="password" autoComplete="current-password" value={passwordDraft}
              onChange={(e) => setPasswordDraft(e.target.value)} />
            <button type="submit">Déverrouiller</button>
          </form>
        )}
        {state.error && (
          <div role="alert" className="banner banner-bad">
            <span className="banner-text">{state.error}</span>
            <button type="button" className="icon-button" aria-label="Fermer le message" onClick={() => dispatch({ type: 'clearError' })}>
              <Icon name="close" />
            </button>
          </div>
        )}
        <main className="steps-main">
          {STEPS.map((s, i) => {
            const next = STEPS[i + 1];
            return (
              <div key={s.id} className={`step step-${s.id}`} hidden={step !== s.id}>
                <header className="step-head">
                  <h2 tabIndex={-1} ref={(el) => { if (el) stepTitles.current.set(s.id, el); }}>{s.title}</h2>
                  <p className="lead">{s.lead}</p>
                </header>
                <div className="step-body">{content[s.id]}</div>
                {next && (
                  <footer className="step-foot">
                    <button type="button" className="secondary" onClick={() => go(next.id)}>
                      {`Étape suivante : ${next.label}`} <Icon name="arrowRight" />
                    </button>
                  </footer>
                )}
              </div>
            );
          })}
        </main>
      </div>
    </div>
  );
}
