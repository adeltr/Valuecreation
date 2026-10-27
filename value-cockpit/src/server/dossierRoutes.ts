import express, { type Router } from 'express';
import type { DossierFile } from '../dossier/format';
import { DossierNotFound, RevisionConflict, type DossierRepository } from '../dossier/repository';

/** REST access to the dossier repository. The repository validates every dossier it stores. */
export function dossierRoutes(repo: DossierRepository): Router {
  const r = express.Router();
  r.use(express.json({ limit: '2mb' }));

  const fail = (res: express.Response, e: unknown) => {
    if (e instanceof RevisionConflict) return res.status(409).json({ error: e.message, current: e.current });
    if (e instanceof DossierNotFound) return res.status(404).json({ error: e.message });
    return res.status(422).json({ error: (e as Error).message });
  };

  r.get('/', async (_req, res) => {
    try { res.json(await repo.list()); } catch (e) { res.status(500).json({ error: (e as Error).message }); }
  });

  r.get('/:name', async (req, res) => {
    try { res.json(await repo.read(req.params.name)); } catch (e) { fail(res, e); }
  });

  r.put('/:name', async (req, res) => {
    const { file, baseRevision } = (req.body ?? {}) as { file?: DossierFile; baseRevision?: number | null };
    if (file?.name !== req.params.name) return res.status(400).json({ error: 'Le nom du dossier ne correspond pas à l\'URL' });
    if (baseRevision !== null && !Number.isInteger(baseRevision)) return res.status(400).json({ error: 'baseRevision manquante' });
    try { res.json({ revision: await repo.save(file, baseRevision ?? null) }); } catch (e) { fail(res, e); }
  });

  r.delete('/:name', async (req, res) => {
    const revision = Number(req.query.revision);
    if (!Number.isInteger(revision)) return res.status(400).json({ error: 'revision manquante' });
    try { await repo.remove(req.params.name, revision); res.status(204).end(); } catch (e) { fail(res, e); }
  });

  return r;
}
