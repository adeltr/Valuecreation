import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { createServer } from './proxy';
import { FileDossierRepository } from './fileRepository';
import { toDossier } from '../dossier/format';
import { initialState, reducer } from '../ui/state/store';

const file = (name: string, lf = 0.82) =>
  toDossier(reducer(reducer(initialState('airline'), { type: 'setName', name }), { type: 'setInput', code: 'LOAD_FACTOR', value: lf }), '2026-10-27T10:00:00Z');

let dir: string;
let server: Server;
let base: string;
beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'vcc-'));
  const app = createServer(async () => '{}', { dossiers: new FileDossierRepository(dir) });
  server = await new Promise<Server>((resolve) => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/dossiers`;
});
afterEach(async () => {
  await new Promise((resolve) => server.close(resolve));
  await rm(dir, { recursive: true, force: true });
});

const url = (name: string) => `${base}/${encodeURIComponent(name)}`;
const put = (name: string, body: unknown) =>
  fetch(url(name), { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

describe('dossier routes', () => {
  it('PUT creates, GET reads, the list shows it', async () => {
    const res = await put('Air X / DD', { file: file('Air X / DD'), baseRevision: null });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ revision: 1 });
    const got = await fetch(url('Air X / DD'));
    expect(await got.json()).toEqual({ file: file('Air X / DD'), revision: 1 });
    expect((await (await fetch(base)).json()).map((d: { name: string }) => d.name)).toEqual(['Air X / DD']);
  });

  it('404 on an unknown dossier', async () => {
    expect((await fetch(url('nope'))).status).toBe(404);
  });

  it('409 with the current revision on a stale save', async () => {
    await put('Air X', { file: file('Air X'), baseRevision: null });
    await put('Air X', { file: file('Air X', 0.7), baseRevision: 1 });
    const res = await put('Air X', { file: file('Air X', 0.6), baseRevision: 1 });
    expect(res.status).toBe(409);
    expect(await res.json()).toMatchObject({ current: 2 });
  });

  it('422 on an invalid dossier, 400 when the URL and the file disagree on the name', async () => {
    expect((await put('Air X', { file: { ...file('Air X'), levers: [{ category: 'BOOK_TO_BILL' }] }, baseRevision: null })).status).toBe(422);
    expect((await put('Air Y', { file: file('Air X'), baseRevision: null })).status).toBe(400);
  });

  it('DELETE needs the current revision', async () => {
    await put('Air X', { file: file('Air X'), baseRevision: null });
    expect((await fetch(`${url('Air X')}?revision=2`, { method: 'DELETE' })).status).toBe(409);
    expect((await fetch(`${url('Air X')}?revision=x`, { method: 'DELETE' })).status).toBe(400);
    expect((await fetch(`${url('Air X')}?revision=1`, { method: 'DELETE' })).status).toBe(204);
    expect((await fetch(url('Air X'))).status).toBe(404);
  });

  it('no dossier routes when the server has no repository', async () => {
    const app = createServer(async () => '{}');
    const s = await new Promise<Server>((resolve) => { const x = app.listen(0, '127.0.0.1', () => resolve(x)); });
    const res = await fetch(`http://127.0.0.1:${(s.address() as AddressInfo).port}/api/dossiers`);
    expect(res.status).toBe(404);
    await new Promise((resolve) => s.close(resolve));
  });
});
