/** Who is at the keyboard and the team's shared password (docs/22). */
export interface Session { analyst: string; password: string }

export const ANALYST_KEY = 'value-cockpit.analyst';   // localStorage: remembered on this browser
export const PASSWORD_KEY = 'value-cockpit.password'; // sessionStorage: forgotten when the tab closes

/** fetch that signs every call with the shared password and the analyst name. */
export function authFetch(base: typeof fetch, session: () => Session): typeof fetch {
  return ((input: RequestInfo | URL, init: RequestInit = {}) => {
    const { analyst, password } = session();
    return base(input, {
      ...init,
      headers: {
        ...(init.headers as Record<string, string> | undefined),
        ...(password ? { 'X-VCC-Password': password } : {}),
        ...(analyst.trim() ? { 'X-VCC-Analyst': encodeURIComponent(analyst.trim()) } : {}),
      },
    });
  }) as typeof fetch;
}

const read = (storage: () => Storage, key: string) => { try { return storage().getItem(key) ?? ''; } catch { return ''; } };
const write = (storage: () => Storage, key: string, value: string) => { try { storage().setItem(key, value); } catch { /* storage unavailable: session only */ } };

export const loadSession = (): Session => ({ analyst: read(() => localStorage, ANALYST_KEY), password: read(() => sessionStorage, PASSWORD_KEY) });
export const saveAnalyst = (name: string) => write(() => localStorage, ANALYST_KEY, name);
export const savePassword = (password: string) => write(() => sessionStorage, PASSWORD_KEY, password);
