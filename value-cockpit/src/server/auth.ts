import { createHash, timingSafeEqual } from 'node:crypto';
import { appendFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { Request, RequestHandler } from 'express';

export interface AuthOptions {
  /** Shared password of the team (VCC_PASSWORD). Absent: no check — the server must stay on localhost. */
  password?: string;
  /** Append-only JSON-lines log of who saved or deleted what. */
  auditFile?: string;
}

const MIN_PASSWORD = 12;
const LOCAL_HOSTS = ['127.0.0.1', 'localhost', '::1'];

/** A server reachable from the network must have a real shared password. */
export function checkExposure(host: string, password: string | undefined): void {
  if (LOCAL_HOSTS.includes(host)) return;
  if (!password) throw new Error(`HOST=${host} expose le serveur au réseau : définissez VCC_PASSWORD (mot de passe partagé) avant de démarrer`);
  if (password.length < MIN_PASSWORD) throw new Error(`VCC_PASSWORD doit faire au moins ${MIN_PASSWORD} caractères pour un serveur exposé au réseau`);
}

const digest = (s: string) => createHash('sha256').update(s).digest();

/** Refuses any /api call without the shared password (constant-time comparison). */
export function requirePassword(password: string | undefined): RequestHandler {
  return (req, res, next) => {
    if (!password) return next();
    const given = req.get('X-VCC-Password') ?? '';
    if (timingSafeEqual(digest(given), digest(password))) return next();
    res.status(401).json({ error: 'Mot de passe partagé manquant ou incorrect' });
  };
}

/** The analyst name the client declares (URL-encoded header). Identification, not authentication. */
export function analystOf(req: Request): string | null {
  try {
    const name = decodeURIComponent(req.get('X-VCC-Analyst') ?? '').trim().slice(0, 80);
    return name || null;
  } catch { return null; }
}

export async function audit(file: string | undefined, entry: { analyst: string; action: string; dossier: string; revision: number }): Promise<void> {
  if (!file) return;
  await mkdir(dirname(file), { recursive: true });
  await appendFile(file, `${JSON.stringify({ at: new Date().toISOString(), ...entry })}\n`);
}
