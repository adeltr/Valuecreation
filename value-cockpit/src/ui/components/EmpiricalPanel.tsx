import { useEffect, useState } from 'react';
import type { SectorArchetype } from '../../ontology/registry';
import type { Quantiles, DeltaMetric } from '../../empirical/stats';
import { percentileRank } from '../../empirical/stats';
import type { Trajectory } from '../../empirical/realism';
import { SIZE_BUCKETS } from '../../empirical/edgar';
import { formatValue } from '../model/format';
import type { Unit } from '../../ontology/base';
import { Panel } from './Panel';

interface Meta { source: string; generatedAt: string; companies: number; countries: { value: string; n: number }[]; sizes: { value: string; n: number }[] }
interface Bench { metrics: Record<DeltaMetric, Quantiles | null>; values: Record<DeltaMetric, number[]> }

const ROWS: [DeltaMetric, string, Unit][] = [
  ['EBITDA_MARGIN', 'Δ marge d\'EBITDA (pts)', 'percent'],
  ['REVENUE_GROWTH', 'Croissance annuelle du CA', 'percent'],
  ['DSO', 'Δ DSO', 'days'], ['DIO', 'Δ DIO', 'days'], ['DPO', 'Δ DPO', 'days'],
];

async function getJson<T>(f: typeof fetch, url: string): Promise<T> {
  const res = await f(url);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error ?? `Erreur ${res.status}`);
  return body as T;
}

/** Public-filings distributions for the company type and the realism of the plan (docs/19). */
export function EmpiricalPanel({ archetype, trajectory, fetchImpl = (...a) => fetch(...a) }: {
  archetype: SectorArchetype; trajectory: Trajectory | null; fetchImpl?: typeof fetch;
}) {
  const [meta, setMeta] = useState<Meta | null>(null);
  const [bench, setBench] = useState<Bench | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [country, setCountry] = useState('');
  const [sizes, setSizes] = useState<string[]>([]);
  const [deals, setDeals] = useState<'all' | 'with' | 'without'>('all');
  const years = trajectory?.years ?? 5;

  useEffect(() => {
    let live = true;
    setMeta(null); setBench(null); setError(null); setCountry(''); setSizes([]); setDeals('all');
    getJson<Meta>(fetchImpl, `/api/empirical/meta?archetype=${encodeURIComponent(archetype)}`)
      .then((m) => { if (live) setMeta(m); })
      .catch((e) => { if (live) setError((e as Error).message); });
    return () => { live = false; };
  }, [archetype]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!meta) return;
    let live = true;
    const qs = new URLSearchParams({ archetype, years: String(years), deals });
    if (country) qs.set('countries', country);
    if (sizes.length) qs.set('sizes', sizes.join(','));
    getJson<Bench>(fetchImpl, `/api/empirical/benchmark?${qs}`)
      .then((b) => { if (live) setBench(b); })
      .catch((e) => { if (live) setError((e as Error).message); });
    return () => { live = false; };
  }, [meta, archetype, years, country, sizes, deals]); // eslint-disable-line react-hooks/exhaustive-deps

  const fmt = (v: number, unit: Unit) => (unit === 'days' ? `${v > 0 ? '+' : ''}${formatValue(v, 'days')}` : formatValue(v, unit));
  const realism = trajectory && bench ? ([
    ['Δ marge d\'EBITDA (pts)', 'EBITDA_MARGIN', trajectory.marginDelta],
    ['Croissance annuelle du CA', 'REVENUE_GROWTH', trajectory.revenueCagr],
  ] as const).map(([label, m, v]) => {
    const q = bench.metrics[m];
    const rank = q ? percentileRank(v.plan, bench.values[m]) : null;
    return { label, v, q, rank };
  }) : [];

  return (
    <Panel title="Repères empiriques" className="empirical">
      {error && <p className="muted">{error}</p>}
      {meta && (
        <>
          <p className="muted">{`${meta.source} · ${meta.companies} sociétés cotées de ce type · import du ${new Date(meta.generatedAt).toLocaleDateString('fr-FR')} · fenêtre ${years} ans`}</p>
          <div className="emp-filters">
            <label>Pays{' '}
              <select aria-label="Pays" value={country} onChange={(e) => setCountry(e.target.value)}>
                <option value="">Tous</option>
                {meta.countries.map((c) => <option key={c.value} value={c.value}>{`${c.value} (${c.n})`}</option>)}
              </select>
            </label>
            <fieldset><legend>Taille (CA au début de la fenêtre, USD)</legend>
              {SIZE_BUCKETS.map((s) => (
                <label key={s}><input type="checkbox" aria-label={s} checked={sizes.includes(s)}
                  onChange={() => setSizes(sizes.includes(s) ? sizes.filter((x) => x !== s) : [...sizes, s])} />{s}</label>
              ))}
            </fieldset>
            <label>Deals{' '}
              <select aria-label="Deals" value={deals} onChange={(e) => setDeals(e.target.value as typeof deals)}>
                <option value="all">Toutes les sociétés</option>
                <option value="with">Avec acquisition réalisée (8-K 2.01)</option>
                <option value="without">Sans acquisition</option>
              </select>
            </label>
          </div>
        </>
      )}
      {bench && (
        <table className="plan-table">
          <thead><tr><th>Mesure</th><th className="num">n</th><th className="num">p10</th><th className="num">p25</th><th className="num">médiane</th><th className="num">p75</th><th className="num">p90</th></tr></thead>
          <tbody>
            {ROWS.map(([m, label, unit]) => {
              const q = bench.metrics[m];
              return (
                <tr key={m}>
                  <td>{label}</td>
                  {q ? (<>
                    <td className="num">{q.n}</td>
                    {[q.p10, q.p25, q.p50, q.p75, q.p90].map((v, i) => <td key={i} className="num">{fmt(v, unit)}</td>)}
                  </>) : <td colSpan={6} className="muted">échantillon insuffisant (moins de 8 sociétés)</td>}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {bench && (
        <>
          <h3>Réalisme du plan (moteur vs sociétés comparables)</h3>
          {!trajectory && <p className="muted">Non calculable pour ce type d'entreprise (pas de CA et d'EBITDA d'entrée dans le modèle).</p>}
          <ul className="list">
            {realism.map(({ label, v, q, rank }) => (
              <li key={label}>
                {`${label} : ${formatValue(v.base, 'percent')} sans levier → ${formatValue(v.plan, 'percent')} avec les leviers validés`}
                {q && rank !== null
                  ? <strong className={v.plan > q.p90 || v.plan < q.p10 ? 'warn' : ''}>{` — ${rank}e percentile${v.plan > q.p90 ? ' : au-delà du p90 observé, à justifier' : ''}`}</strong>
                  : <span className="muted"> — pas assez de comparables</span>}
              </li>
            ))}
          </ul>
          <p className="footnote">Sociétés cotées déposant à la SEC (y compris émetteurs étrangers). EBITDA = résultat opérationnel + D&A publiés. Repères, pas cibles.</p>
        </>
      )}
    </Panel>
  );
}
