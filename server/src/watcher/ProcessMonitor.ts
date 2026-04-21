import { config } from '../config.js';
import type { WormInstance } from '../types.js';

export class ProcessMonitor {
  private interval: NodeJS.Timeout | null = null;
  private instances: WormInstance[] = [];
  private onDied: ((pid: number, sessionId: string) => void) | null = null;

  start(
    getInstances: () => WormInstance[],
    onDied: (pid: number, sessionId: string) => void,
  ): void {
    this.getInstances = getInstances;
    this.onDied = onDied;

    this.interval = setInterval(() => {
      this.checkProcesses();
    }, config.PROCESS_MONITOR_INTERVAL);
  }

  private getInstances: (() => WormInstance[]) | null = null;

  private checkProcesses(): void {
    if (!this.getInstances) return;

    const instances = this.getInstances();
    for (const instance of instances) {
      try {
        process.kill(instance.pid, 0);
      } catch {
        // Process is dead
        this.onDied?.(instance.pid, instance.sessionId);
      }
    }
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}
