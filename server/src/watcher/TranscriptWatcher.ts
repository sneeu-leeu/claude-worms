import chokidar from 'chokidar';
import { config } from '../config.js';
import { TranscriptParser } from '../discovery/TranscriptParser.js';
import type { WormInstance } from '../types.js';
import type { FSWatcher } from 'chokidar';

interface TranscriptState {
  path: string;
  lastPosition: number;
}

export class TranscriptWatcher {
  private watcher: FSWatcher | null = null;
  private transcripts = new Map<string, TranscriptState>();
  private onActivity: ((instance: Partial<WormInstance>) => void) | null = null;
  private sessionWatcher: any = null;

  start(
    getInstances: () => WormInstance[],
    onActivity: (update: Partial<WormInstance>) => void,
  ): void {
    this.onActivity = onActivity;

    // Watch all JSONL files in projects directory
    this.watcher = chokidar.watch(`${config.PROJECTS_DIR}/**/*.jsonl`, {
      awaitWriteFinish: { stabilityThreshold: 100 },
      usePolling: false,
      persistent: true,
    });

    this.watcher.on('change', (filePath: string) => {
      this.handleTranscriptChange(filePath, getInstances);
    });
  }

  private handleTranscriptChange(filePath: string, getInstances: () => WormInstance[]): void {
    try {
      const instances = getInstances();
      const summary = TranscriptParser.parseJsonl(filePath);

      // Find the instance that owns this JSONL
      for (const instance of instances) {
        // Match the JSONL path to instance
        const expectedPath = `${config.PROJECTS_DIR}/${this.encodeCwd(instance.cwd)}/${instance.sessionId}.jsonl`;
        if (filePath.includes(instance.sessionId)) {
          // Emit activity update
          this.onActivity?.({
            pid: instance.pid,
            lastOutput: summary.lastMessageText,
            lastActivity: summary.lastActivityTime,
            messageCount: summary.messageCount,
            health: Math.max(0, Math.min(100, 100 - (Date.now() - summary.lastActivityTime) / 30000)),
          });
          break;
        }
      }
    } catch (err) {
      console.error('Error handling transcript change:', err);
    }
  }

  private encodeCwd(cwd: string): string {
    return cwd.replace(/\//g, '-').replace(/^-/, '');
  }

  stop(): void {
    this.watcher?.close();
  }
}
