import type { Unit } from '../../ontology/base';

const nf = (opts: Intl.NumberFormatOptions) => new Intl.NumberFormat('fr-FR', opts);

/** The ONLY place figures are rounded (docs/02: round at the display boundary). */
export function formatValue(value: number | undefined | null, unit: Unit): string {
  if (value === undefined || value === null || !Number.isFinite(value)) return '—';
  switch (unit) {
    case 'percent': return nf({ style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value);
    case 'ratio': return `${nf({ minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)}x`;
    case 'days': return `${nf({ maximumFractionDigits: 0 }).format(value)} j`;
    case 'years': return `${nf({ maximumFractionDigits: 1 }).format(value)} ans`;
    // Counts are often expressed in millions (ASK, passengers): keep decimals on small values.
    case 'count': return nf({ maximumFractionDigits: Math.abs(value) < 100 ? 2 : 0 }).format(value);
    case 'currency':
      // Unit costs (yield, CASK) are fractions of a currency unit: keep significant digits.
      return Math.abs(value) < 1
        ? nf({ maximumSignificantDigits: 3 }).format(value)
        : nf({ maximumFractionDigits: 1 }).format(value);
  }
}
