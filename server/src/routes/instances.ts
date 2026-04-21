import { Router, Request, Response } from 'express';
import { ItermBridge } from '../discovery/ItermBridge.js';
import type { SessionWatcher } from '../watcher/SessionWatcher.js';

export function createInstanceRoutes(sessionWatcher: SessionWatcher): Router {
  const router = Router();

  router.get('/api/instances', (req: Request, res: Response) => {
    const instances = sessionWatcher.getAllInstances();
    res.json(instances);
  });

  router.post('/api/instances', async (req: Request, res: Response) => {
    try {
      const { projectPath } = req.body;

      if (!projectPath) {
        res.status(400).json({ error: 'projectPath is required' });
        return;
      }

      await ItermBridge.spawnNewInstance(projectPath);
      res.json({ success: true });
    } catch (err) {
      console.error('Error spawning instance:', err);
      res.status(500).json({ error: 'Failed to spawn instance' });
    }
  });

  router.get('/api/instances/:pid', (req: Request, res: Response) => {
    const pid = parseInt(req.params.pid, 10);
    const instance = sessionWatcher.getInstance(pid);

    if (!instance) {
      res.status(404).json({ error: 'Instance not found' });
      return;
    }

    res.json(instance);
  });

  router.delete('/api/instances/:pid', (req: Request, res: Response) => {
    try {
      const pid = parseInt(req.params.pid, 10);
      const { signal = 'SIGTERM' } = req.body;

      const instance = sessionWatcher.getInstance(pid);
      if (!instance) {
        res.status(404).json({ error: 'Instance not found' });
        return;
      }

      // Validate signal
      const validSignals = ['SIGTERM', 'SIGKILL', 'SIGHUP'];
      if (!validSignals.includes(signal)) {
        res.status(400).json({ error: 'Invalid signal' });
        return;
      }

      try {
        process.kill(pid, signal);
        res.json({ success: true, pid, signal });
      } catch (err) {
        res.status(500).json({ error: 'Failed to kill process' });
      }
    } catch (err) {
      console.error('Error killing instance:', err);
      res.status(500).json({ error: 'Invalid request' });
    }
  });

  router.post('/api/instances/:pid/focus', async (req: Request, res: Response) => {
    try {
      const pid = parseInt(req.params.pid, 10);
      const instance = sessionWatcher.getInstance(pid);

      if (!instance) {
        res.status(404).json({ error: 'Instance not found' });
        return;
      }

      await ItermBridge.focusTab(instance.tty);
      res.json({ success: true });
    } catch (err) {
      console.error('Error focusing tab:', err);
      res.status(500).json({ error: 'Failed to focus tab' });
    }
  });

  return router;
}
