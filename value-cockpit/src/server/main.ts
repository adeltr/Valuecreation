import { resolve } from 'node:path';
import { createServer } from './proxy';
import { FileDossierRepository } from './fileRepository';
import { datasetFile } from './empiricalRoutes';

// `npm run server` — dossier storage + copilot proxy behind Vite's /api proxy (vite.config.ts).
// Listens on localhost only: there is no authentication yet, so exposing it to a network
// needs an authenticating reverse proxy in front (docs/15).
const port = Number(process.env.PORT ?? 8787);
const host = process.env.HOST ?? '127.0.0.1';
const dir = resolve(process.env.VCC_DOSSIER_DIR ?? 'data/dossiers');

const callModel = async (): Promise<string> => {
  throw new Error('copilote non branché sur ce serveur : colle la proposition JSON dans le panneau Copilote');
};

createServer(callModel, {
  dossiers: new FileDossierRepository(dir),
  empirical: datasetFile(resolve(process.env.VCC_EMPIRICAL_FILE ?? 'data/empirical/sec-windows.json')),
}).listen(port, host, () => {
  console.log(`value-cockpit server on http://${host}:${port} — dossiers in ${dir}`);
});
