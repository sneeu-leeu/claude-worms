import { Router, Request, Response } from 'express';
import { loadavg, uptime } from 'os';

export function createSystemRoutes(): Router {
  const router = Router();

  router.get('/api/system', (req: Request, res: Response) => {
    const loads = loadavg();
    const uptimeSeconds = uptime();

    res.json({
      load1: loads[0],
      load5: loads[1],
      load15: loads[2],
      uptime: uptimeSeconds,
    });
  });

  return router;
}
