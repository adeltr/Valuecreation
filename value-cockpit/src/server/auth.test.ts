import { describe, it, expect, afterEach } from 'vitest';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from './proxy';
import { FileDossierRepository } from './fileRepository';
import { checkExposure } from './auth';
import { toDossier } from '../dossier/format';
import { initialState, reducer } from '../ui/state/store';

let server: Server | null = null;
let dir = '';
async function start(password?: string) {
  dir = await mkdtemp(join(tmpdir(), 'vcc-'));
  const app = createServer(async () => '{}', { dossiers: new FileDossierRepository(dir), auth: { password, auditFile: join(dir, 'audit.log') } });
  server = await new Promise<Server>((r) => { const s = app.listen(0, '127.0.0.1', () => r(s)); });
  return `http://127.0.0.1:${(server.address() as AddressInfo).port}/api`;
}
afterEach(async () => { if (server) await new Promise((r) => server!.close(r)); server = null; await rm(dir, { recursive: true, force: true }); });

const headers = (password?: string, analyst?: string) => ({
  'Content-Type': 'application/json',
  ...(password ? { 'X-VCC-Password': password } : {}), ...(analyst ? { 'X-VCC-Analyst': encodeURIComponent(analyst) } : {}),
});
const file = toDossier(reducer(initialState('airline'), { type: 'setName', name: 'Air X' }), 't');

describe('shared password and analyst name', () => {
  it('says whether a password is required, without needing one', async () => {
    expect(await (await fetch(`${await start('s3cret')}/session`)).json()).toEqual({ passwordRequired: true });
    await new Promise((r) => server!.close(r));
    expect(await (await fetch(`${await start()}/session`)).json()).toEqual({ passwordRequired: false });
  });

  it('refuses every API call without the right password', async () => {
    const api = await start('s3cret');
    expect((await fetch(`${api}/dossiers`)).status).toBe(401);
    expect((await fetch(`${api}/dossiers`, { headers: headers('wrong', 'Léa') })).status).toBe(401);
    expect((await fetch(`${api}/propose`, { method: 'POST', headers: headers(undefined, 'Léa'), body: '{}' })).status).toBe(401);
    expect((await fetch(`${api}/dossiers`, { headers: headers('s3cret', 'Léa') })).status).toBe(200);
  });

  it('a write needs an analyst name; the server records who saved, in the dossier and in the audit log', async () => {
    const api = await start('s3cret');
    const put = (analyst?: string) => fetch(`${api}/dossiers/${encodeURIComponent('Air X')}`, {
      method: 'PUT', headers: headers('s3cret', analyst), body: JSON.stringify({ file, baseRevision: null }),
    });
    expect((await put()).status).toBe(400);
    expect((await put('Léa Martin')).status).toBe(200);
    const list = await (await fetch(`${api}/dossiers`, { headers: headers('s3cret', 'Léa Martin') })).json();
    expect(list[0]).toMatchObject({ name: 'Air X', revision: 1, savedBy: 'Léa Martin' });
    const log = (await readFile(join(dir, 'audit.log'), 'utf8')).trim().split('\n').map((l) => JSON.parse(l));
    expect(log).toEqual([expect.objectContaining({ analyst: 'Léa Martin', action: 'save', dossier: 'Air X', revision: 1 })]);
    expect(log[0].at).toMatch(/^\d{4}-/);
  });

  it('without a password the server must stay on this machine', () => {
    expect(() => checkExposure('0.0.0.0', undefined)).toThrow(/VCC_PASSWORD/);
    expect(() => checkExposure('127.0.0.1', undefined)).not.toThrow();
    expect(() => checkExposure('0.0.0.0', 'long-enough-password')).not.toThrow();
    expect(() => checkExposure('0.0.0.0', 'short')).toThrow(/12/);
  });
});
