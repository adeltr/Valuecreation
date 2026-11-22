import express, { type Router } from 'express';
import { companyProfile, entryFacts, type CompanyFacts, type Submissions } from '../empirical/edgar';

export interface FilingsClient {
  cikOf(ticker: string): Promise<number | null>;
  submissions(cik: number): Promise<Submissions>;
  companyFacts(cik: number): Promise<CompanyFacts>;
}

/** Entry facts of a listed company from its latest annual SEC filing (docs/23). */
export function filingsRoutes(getClient: () => FilingsClient | null): Router {
  const r = express.Router();
  r.get('/', async (req, res) => {
    const client = getClient();
    if (!client) return res.status(503).json({ error: 'Comptes publics indisponibles : définissez SEC_USER_AGENT ("Prénom Nom adresse@e-mail") avant « npm run server »' });
    const ticker = String(req.query.ticker ?? '').trim().toUpperCase();
    if (!/^[A-Z0-9.-]{1,10}$/.test(ticker)) return res.status(400).json({ error: 'Ticker invalide' });
    try {
      const cik = await client.cikOf(ticker);
      if (cik === null) return res.status(404).json({ error: `Ticker inconnu de la SEC : ${ticker}` });
      const [subs, cf] = [await client.submissions(cik), await client.companyFacts(cik)];
      const facts = entryFacts(cf);
      if (!facts) return res.status(404).json({ error: `Aucun compte annuel exploitable pour ${ticker}` });
      const profile = companyProfile(subs);
      res.json({
        ticker, cik, name: profile.name, archetype: profile.archetype, country: profile.country,
        fiscalYear: facts.fiscalYear, currency: 'USD', values: facts.values, missing: facts.missing,
        source: `https://data.sec.gov/api/xbrl/companyfacts/CIK${String(cik).padStart(10, '0')}.json`,
      });
    } catch (e) {
      res.status(502).json({ error: `SEC injoignable ou réponse illisible : ${(e as Error).message}` });
    }
  });
  return r;
}
