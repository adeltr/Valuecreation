import { useState, type FormEvent } from 'react';
import type { Lever } from '../../domain/types';
import { getActiveVocabulary, type SectorArchetype } from '../../ontology/registry';
import { describeMetric, humanize } from '../../ontology/labels';
import { modelTargets } from '../../templates/targets';
import type { Unit } from '../../ontology/base';
import type { LeverDraft } from '../state/store';

interface Props {
  archetype: SectorArchetype;
  /** The lever being edited; absent for a new one. */
  lever?: Lever;
  onSubmit: (draft: LeverDraft) => void;
  onCancel: () => void;
}

const ABSOLUTE_HINT: Record<Unit, string> = {
  percent: 'en points : 0,01 = +1 pt', days: 'en jours', years: 'en années', currency: 'en montant',
  ratio: 'dans l\'unité du ratio', count: 'en nombre',
};

/** A lever written or edited by the analyst. The store applies the same rules as for the copilot. */
export function LeverForm({ archetype, lever, onSubmit, onCancel }: Props) {
  const vocab = getActiveVocabulary(archetype);
  const targets = modelTargets(archetype);
  const [f, setF] = useState({
    label: lever?.label ?? '', mechanism: lever?.mechanism ?? '',
    category: lever?.category ?? vocab.leverCategories[0],
    impactMetricCode: lever?.impactMetricCode ?? targets.quantified[0] ?? targets.diagnostic[0] ?? '',
    expectedDelta: String(lever?.expectedDelta ?? ''), deltaKind: lever?.deltaKind ?? 'absolute',
    timeToImpactDays: String(lever?.timeToImpactDays ?? 90), effort: lever?.effort ?? 'medium',
    confidence: String(lever?.confidence ?? 0.5), confidenceBasis: lever?.confidenceBasis ?? '',
    implementationCost: String(lever?.implementationCost ?? 0),
  });
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });
  const unit = vocab.metricMeta[f.impactMetricCode]?.unit ?? 'ratio';
  const option = (c: string) => <option key={c} value={c}>{`${describeMetric(c, archetype).label} · ${c}`}</option>;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      label: f.label.trim(), mechanism: f.mechanism.trim(), category: f.category, impactMetricCode: f.impactMetricCode,
      expectedDelta: Number(f.expectedDelta), deltaKind: f.deltaKind as Lever['deltaKind'],
      timeToImpactDays: Number(f.timeToImpactDays), effort: f.effort as Lever['effort'],
      confidence: Number(f.confidence), confidenceBasis: f.confidenceBasis.trim(),
      implementationCost: Number(f.implementationCost),
    });
  };

  return (
    <form className="lever-form" aria-label={lever ? 'Modifier le levier' : 'Nouveau levier'} onSubmit={submit} noValidate>
      <label>Libellé<input aria-label="Libellé" value={f.label} onChange={set('label')} /></label>
      <label>Mécanisme<input aria-label="Mécanisme" value={f.mechanism} onChange={set('mechanism')} placeholder="Comment le levier agit" /></label>
      <label>Catégorie
        <select aria-label="Catégorie" value={f.category} onChange={set('category')}>
          {vocab.leverCategories.map((c) => <option key={c} value={c}>{`${humanize(c)} · ${c}`}</option>)}
        </select>
      </label>
      <label>Métrique cible
        <select aria-label="Métrique cible" value={f.impactMetricCode} onChange={set('impactMetricCode')}>
          <optgroup label="Inputs du modèle (impact chiffré par le moteur)">{targets.quantified.map(option)}</optgroup>
          <optgroup label="Diagnostics (levier qualitatif, non simulé)">{targets.diagnostic.map(option)}</optgroup>
        </select>
      </label>
      <label>Variation attendue <span className="muted">{f.deltaKind === 'percent' ? 'relatif : 0,05 = +5 %' : ABSOLUTE_HINT[unit]}</span>
        <input aria-label="Variation attendue" type="number" step="any" value={f.expectedDelta} onChange={set('expectedDelta')} />
      </label>
      <label>Type de variation
        <select aria-label="Type de variation" value={f.deltaKind} onChange={set('deltaKind')}>
          <option value="absolute">Absolue (dans l'unité de la métrique)</option>
          <option value="percent">Relative (en % de la valeur actuelle)</option>
        </select>
      </label>
      <label>Délai du premier impact (jours)
        <input aria-label="Délai du premier impact (jours)" type="number" min="0" step="1" value={f.timeToImpactDays} onChange={set('timeToImpactDays')} />
      </label>
      <label>Effort
        <select aria-label="Effort" value={f.effort} onChange={set('effort')}>
          <option value="low">Faible</option><option value="medium">Moyen</option><option value="high">Élevé</option>
        </select>
      </label>
      <label>Confiance <span className="muted">de 0 à 1</span>
        <input aria-label="Confiance" type="number" min="0" max="1" step="0.05" value={f.confidence} onChange={set('confidence')} />
      </label>
      <label>Base de la confiance
        <input aria-label="Base de la confiance" value={f.confidenceBasis} onChange={set('confidenceBasis')} placeholder="Analyse, cas comparable, donnée…" />
      </label>
      <label>Coût de mise en œuvre <span className="muted">montant non récurrent</span>
        <input aria-label="Coût de mise en œuvre" type="number" min="0" step="any" value={f.implementationCost} onChange={set('implementationCost')} />
      </label>
      <div className="actions">
        <button type="submit">{lever ? 'Enregistrer' : 'Ajouter'}</button>
        <button type="button" className="secondary" onClick={onCancel}>Annuler</button>
      </div>
    </form>
  );
}
