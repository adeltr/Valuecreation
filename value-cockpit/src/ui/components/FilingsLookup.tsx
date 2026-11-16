import { useState, type Dispatch } from 'react';
import type { Action } from '../state/store';
import type { CompanyContext } from '../../dossier/format';
import type { Unit } from '../../ontology/base';
import { formatValue } from '../model/format';

interface Filing {
  ticker: string; name: string; archetype: string | null; fiscalYear: number; currency: string;
  values: Record<string, number>; missing: string[]; source: string;
}
interface Props {
  /** Unit of each input of the model, by code. */
  inputUnits: Record<string, Unit>;
  context: CompanyContext; analyst: string; fetchImpl: typeof fetch; dispatch: Dispatch<Action>;
}

const SCALE = { k: 1e3, M: 1e6, Md: 1e9 };
const today = () => new Date().toISOString().slice(0, 10);

/** Entry facts from a listed company's latest annual filing — the most reliable public source (docs/23). */
export function FilingsLookup({ inputUnits, context, analyst, fetchImpl, dispatch }: Props) {
  const [ticker, setTicker] = useState('');
  const [filing, setFiling] = useState<Filing | null>(null);
  const [pending, setPending] = useState(false);

  const search = async () => {
    setPending(true); setFiling(null);
    try {
      const res = await fetchImpl(`/api/filings?ticker=${encodeURIComponent(ticker.trim())}`);
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? `Erreur ${res.status}`);
      setFiling(body as Filing);
    } catch (e) {
      dispatch({ type: 'reportError', message: `Comptes publics : ${(e as Error).message}` });
    } finally { setPending(false); }
  };

  // Filed amounts are in units of the filing currency: bring them to the dossier scale.
  const scaled = (code: string, v: number) => (inputUnits[code] === 'currency' ? v / SCALE[context.scale] : v);
  const usable = filing ? Object.entries(filing.values).filter(([c]) => c in inputUnits) : [];
  const unused = filing ? Object.keys(filing.values).filter((c) => !(c in inputUnits)) : [];

  return (
    <div className="filings">
      <label>Ticker (société cotée aux États-Unis){' '}
        <input aria-label="Ticker (société cotée aux États-Unis)" value={ticker} size={8} onChange={(e) => setTicker(e.target.value)} />
      </label>{' '}
      <button type="button" className="secondary" disabled={!ticker.trim() || pending} onClick={search}>
        {pending ? 'Recherche…' : 'Chercher les comptes publics'}
      </button>
      {filing && (
        <fieldset className="calc" aria-label={`${filing.name} (${filing.ticker})`}>
          <legend>{`${filing.name} (${filing.ticker})`}</legend>
          <p className="muted">{`Dépôt annuel à la SEC, exercice ${filing.fiscalYear}, montants convertis en ${context.scale} ${filing.currency}.`}</p>
          {filing.currency !== context.currency && (
            <p className="warn">{`Le dossier est en ${context.currency} et le dépôt en ${filing.currency} : changez la devise du dossier ou convertissez les montants.`}</p>
          )}
          <ul className="list">
            {usable.map(([code, v]) => <li key={code}>{`${code} : ${formatValue(scaled(code, v), inputUnits[code] === 'percent' ? 'percent' : 'count')}`}</li>)}
            {unused.map((code) => <li key={code} className="muted">{`${code} : lu dans le dépôt, mais pas un input de ce modèle`}</li>)}
          </ul>
          {filing.missing.length > 0 && <p className="muted">{`Non lus dans le dépôt : ${filing.missing.join(', ')}. La dette nette reste à saisir.`}</p>}
          <button type="button" disabled={usable.length === 0} onClick={() => {
            dispatch({
              type: 'setInputs', values: Object.fromEntries(usable.map(([c, v]) => [c, scaled(c, v)])),
              source: 'filing', ref: `SEC, exercice ${filing.fiscalYear} — ${filing.source}`, by: analyst.trim(), at: today(),
            });
            setFiling(null);
          }}>{`Appliquer ${usable.length} valeur${usable.length > 1 ? 's' : ''}`}</button>{' '}
          <button type="button" className="secondary" onClick={() => setFiling(null)}>Annuler</button>
        </fieldset>
      )}
    </div>
  );
}
