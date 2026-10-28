import express, { type Router } from 'express';
import { readFileSync, statSync } from 'node:fs';
import { SECTOR_ARCHETYPES, type SectorArchetype } from '../ontology/registry';
import { benchmark, select, type BenchmarkFilter, type DeltaMetric } from '../empirical/stats';
import { SIZE_BUCKETS, type SizeBucket } from '../empirical/edgar';
import type { EmpiricalDataset } from '../empirical/importer';

const METRICS: DeltaMetric[] = ['EBITDA_MARGIN', 'REVENUE_GROWTH', 'DSO', 'DIO', 'DPO'];
const list = (v: unknown) => (typeof v === 'string' && v ? v.split(',').map((x) => x.trim()).filter(Boolean) : []);
const counts = (xs: string[]) => [...xs.reduce((m, x) => m.set(x, (m.get(x) ?? 0) + 1), new Map<string, number>())]
  .map(([value, n]) => ({ value, n })).sort((a, b) => b.n - a.n);

/** Reads the imported dataset, reloading it when the file changes. */
export function datasetFile(path: string): () => EmpiricalDataset | null {
  let cache: { mtime: number; data: EmpiricalDataset } | null = null;
  return () => {
    try {
      const mtime = statSync(path).mtimeMs;
      if (!cache || cache.mtime !== mtime) cache = { mtime, data: JSON.parse(readFileSync(path, 'utf8')) };
      return cache.data;
    } catch { return null; }
  };
}

/** Public-filings benchmarks (docs/19). Distributions only, with their sample size and source. */
export function empiricalRoutes(load: () => EmpiricalDataset | null): Router {
  const r = express.Router();
  const missing = { error: 'Base empirique absente : lancer « npm run empirical:import » (docs/19).' };

  r.get('/meta', (req, res) => {
    const data = load();
    if (!data) return res.status(404).json(missing);
    const archetype = String(req.query.archetype ?? '');
    const rows = data.records.filter((x) => x.archetype === archetype);
    const companies = new Map(rows.map((x) => [x.cik, x]));
    res.json({
      source: data.source, generatedAt: data.generatedAt, years: data.years, companies: companies.size,
      countries: counts([...companies.values()].map((x) => x.country)),
      sizes: counts([...companies.values()].map((x) => x.sizeBucket)),
    });
  });

  r.get('/benchmark', (req, res) => {
    const data = load();
    if (!data) return res.status(404).json(missing);
    const archetype = String(req.query.archetype ?? '');
    const years = Number(req.query.years);
    if (!(SECTOR_ARCHETYPES as readonly string[]).includes(archetype) || ![3, 5].includes(years)) {
      return res.status(400).json({ error: 'archetype inconnu ou fenêtre différente de 3 ou 5 ans' });
    }
    const filter: BenchmarkFilter = {
      archetype: archetype as SectorArchetype, years,
      sizes: list(req.query.sizes).filter((s): s is SizeBucket => (SIZE_BUCKETS as readonly string[]).includes(s)),
      countries: list(req.query.countries),
      deals: (['all', 'with', 'without'] as const).find((d) => d === req.query.deals) ?? 'all',
    };
    const rows = select(data.records, filter);
    res.json({
      filter, source: data.source, generatedAt: data.generatedAt,
      metrics: Object.fromEntries(METRICS.map((m) => [m, benchmark(data.records, m, filter)])),
      values: Object.fromEntries(METRICS.map((m) => [m, rows.map((x) => x.deltas[m]).filter((v): v is number => v !== undefined)])),
    });
  });
  return r;
}
