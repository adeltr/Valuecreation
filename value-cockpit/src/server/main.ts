import { resolve } from 'node:path';
import { createServer } from './proxy';
import { FileDossierRepository } from './fileRepository';
import { datasetFile } from './empiricalRoutes';
import { COPILOT_MODEL, hasAnthropicCredentials, makeCallModel } from './anthropic';

// `npm run server` — dossier storage + copilot proxy behind Vite's /api proxy (vite.config.ts).
// Listens on localhost only: there is no authentication yet, so exposing it to a network
// needs an authenticating reverse proxy in front (docs/15).
const port = Number(process.env.PORT ?? 8787);
const host = process.env.HOST ?? '127.0.0.1';
const dir = resolve(process.env.VCC_DOSSIER_DIR ?? 'data/dossiers');

const offline = async (): Promise<string> => {
  throw new Error('copilote non branché sur ce serveur : définissez ANTHROPIC_API_KEY avant « npm run server », ou collez la proposition JSON dans le panneau Copilote');
};
const connected = hasAnthropicCredentials(process.env);
const callModel = connected ? makeCallModel() : offline;

createServer(callModel, {
  dossiers: new FileDossierRepository(dir),
  empirical: datasetFile(resolve(process.env.VCC_EMPIRICAL_FILE ?? 'data/empirical/sec-windows.json')),
}).listen(port, host, () => {
  console.log(`value-cockpit server on http://${host}:${port} — dossiers in ${dir}`);
  console.log(connected ? `copilote : ${COPILOT_MODEL}` : 'copilote : hors ligne (ANTHROPIC_API_KEY absent)');
});
