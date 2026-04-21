import chokidar from 'chokidar';
import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from '../config.js';
import { InstanceDiscovery } from '../discovery/InstanceDiscovery.js';
import { ItermBridge } from '../discovery/ItermBridge.js';
import type { WormInstance, SessionFile } from '../types.js';
import type { FSWatcher } from 'chokidar';

export class SessionWatcher {
  private watcher: FSWatcher | null = null;
  private instances = new Map<string, WormInstance>();
  private onSpawned: ((instance: WormInstance) => void) | null = null;
  private onDied: ((pid: number, sessionId: string) => void) | null = null;

  async start(
    onSpawned: (instance: WormInstance) => void,
    onDied: (pid: number, sessionId: string) => void,
  ): Promise<void> {
    this.onSpawned = onSpawned;
    this.onDied = onDied;

    // Start watching session files
    this.watcher = chokidar.watch(`${config.SESSIONS_DIR}/*.json`, {
      awaitWriteFinish: { stabilityThreshold: 200 },
      usePolling: false,
      persistent: true,
    });

    this.watcher.on('add', (filePath: string) => this.handleSessionAdded(filePath));
    this.watcher.on('unlink', (filePath: string) => this.handleSessionRemoved(filePath));

    // Initial scan of existing sessions
    await this.scanExistingSessions();
  }

  private async handleSessionAdded(filePath: string): Promise<void> {
    try {
      const sessionFile = JSON.parse(readFileSync(filePath, 'utf-8')) as SessionFile;
      const itermNames = await ItermBridge.getSessionNames();
      const instance = await InstanceDiscovery.enrichInstance(sessionFile, itermNames);

      if (instance) {
        this.instances.set(instance.sessionId, instance);
        this.onSpawned?.(instance);
      }
    } catch (err) {
      console.error('Error handling session added:', err);
    }
  }

  private handleSessionRemoved(filePath: string): void {
    try {
      const fileName = filePath.split('/').pop() || '';
      const sessionId = fileName.replace('.json', '');
      const instance = this.instances.get(sessionId);

      if (instance) {
        this.instances.delete(sessionId);
        this.onDied?.(instance.pid, instance.sessionId);
      }
    } catch (err) {
      console.error('Error handling session removed:', err);
    }
  }

  private async scanExistingSessions(): Promise<void> {
    try {
      const fs = await import('fs/promises');
      const files = await fs.readdir(config.SESSIONS_DIR);

      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = join(config.SESSIONS_DIR, file);
          await this.handleSessionAdded(filePath);
        }
      }
    } catch (err) {
      console.error('Error scanning existing sessions:', err);
    }
  }

  getAllInstances(): WormInstance[] {
    return Array.from(this.instances.values());
  }

  getInstance(pid: number): WormInstance | null {
    for (const instance of this.instances.values()) {
      if (instance.pid === pid) {
        return instance;
      }
    }
    return null;
  }

  stop(): void {
    this.watcher?.close();
  }
}
