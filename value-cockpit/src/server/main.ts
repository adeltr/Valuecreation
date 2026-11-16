import { join, resolve } from 'node:path';
import { createServer } from './proxy';
import { FileDossierRepository } from './fileRepository';
import { datasetFile } from './empiricalRoutes';
import { checkExposure } from './auth';
import { COPILOT_MODEL, hasAnthropicCredentials, makeCallModel } from './anthropic';

// `npm run server` — dossier storage + copilot proxy behind Vite's /api proxy (vite.config.ts).
// Localhost by default. HOST=0.0.0.0 opens it to the internal network and then requires
// VCC_PASSWORD, the team's shared password (docs/22).
const port = Number(process.env.PORT ?? 8787);
const host = process.env.HOST ?? '127.0.0.1';
const dir = resolve(process.env.VCC_DOSSIER_DIR ?? 'data/dossiers');

const offline = async (): Promise<string> => {
  throw new Error('copilote non branché sur ce serveur : définissez ANTHROPIC_API_KEY avant « npm run server », ou collez la proposition JSON dans le panneau Copilote');
};
const password = process.env.VCC_PASSWORD || undefined;
try { checkExposure(host, password); } catch (e) { console.error(`✗ ${(e as Error).message}`); process.exit(1); }
const connected = hasAnthropicCredentials(process.env);
const callModel = connected ? makeCallModel() : offline;

createServer(callModel, {
  dossiers: new FileDossierRepository(dir),
  auth: { password, auditFile: join(dir, 'audit.log') },
  empirical: datasetFile(resolve(process.env.VCC_EMPIRICAL_FILE ?? 'data/empirical/sec-windows.json')),
}).listen(port, host, () => {
  console.log(`value-cockpit server on http://${host}:${port} — dossiers in ${dir}`);
  console.log(password ? 'accès : mot de passe partagé requis' : 'accès : sans mot de passe (cette machine uniquement)');
  console.log(connected ? `copilote : ${COPILOT_MODEL}` : 'copilote : hors ligne (ANTHROPIC_API_KEY absent)');
});
