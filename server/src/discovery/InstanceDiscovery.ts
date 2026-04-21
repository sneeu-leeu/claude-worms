import { stat } from 'fs/promises';
import { join } from 'path';
import { config, encodeCwd } from '../config.js';
import { TranscriptParser } from './TranscriptParser.js';
import type { WormInstance, SessionFile } from '../types.js';

export class InstanceDiscovery {
  static async enrichInstance(
    sessionFile: SessionFile,
    itermNames: Map<string, string>,
  ): Promise<WormInstance | null> {
    const now = Date.now();

    // Verify process is still alive
    try {
      process.kill(sessionFile.pid, 0);
    } catch {
      return null; // Process is dead
    }

    // Build JSONL path
    const encodedCwd = encodeCwd(sessionFile.cwd);
    const jsonlPath = join(
      config.PROJECTS_DIR,
      encodedCwd,
      `${sessionFile.sessionId}.jsonl`,
    );

    // Parse transcript
    const transcript = TranscriptParser.parseJsonl(jsonlPath);

    // Get iTerm session name (current task)
    const currentTask = sessionFile.tty ? (itermNames.get(sessionFile.tty) || 'Unknown Task') : 'Unknown Task';

    // Calculate health based on last activity
    const lastActivity = transcript.lastActivityTime;
    const secondsIdle = (now - lastActivity) / 1000;
    const health = Math.max(0, Math.min(100, 100 - secondsIdle / 3));

    // Determine status
    let status: 'active' | 'idle' | 'sleeping' | 'waiting' = 'active';
    if (secondsIdle > config.SLEEP_THRESHOLD / 1000) {
      status = 'sleeping';
    } else if (secondsIdle > config.IDLE_THRESHOLD / 1000) {
      status = 'idle';
    } else if (!transcript.lastMessageText || transcript.lastMessageText.includes('Waiting')) {
      status = 'waiting';
    }

    const uptime = now - sessionFile.startedAt;

    return {
      pid: sessionFile.pid,
      sessionId: sessionFile.sessionId,
      cwd: sessionFile.cwd,
      startedAt: sessionFile.startedAt,
      tty: sessionFile.tty,
      currentTask,
      lastActivity,
      health,
      status,
      lastOutput: transcript.lastMessageText,
      messageCount: transcript.messageCount,
      uptime,
    };
  }
}
