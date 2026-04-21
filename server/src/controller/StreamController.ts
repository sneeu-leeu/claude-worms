import { Socket } from 'socket.io';
import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from '../config.js';
import type { WormInstance } from '../types.js';

export class StreamController {
  static startSpectate(socket: Socket, worm: WormInstance, getInstances: () => WormInstance[]): void {
    const encodedCwd = worm.cwd.replace(/\//g, '-').replace(/^-/, '');
    const jsonlPath = join(config.PROJECTS_DIR, encodedCwd, `${worm.sessionId}.jsonl`);

    try {
      // Read the JSONL file and send recent messages
      const content = readFileSync(jsonlPath, 'utf-8');
      const lines = content.trim().split('\n').filter((l) => l.length > 0);

      // Send last 50 lines (messages)
      const recentLines = lines.slice(-50);
      const messages = recentLines
        .map((line) => {
          try {
            const entry = JSON.parse(line);
            if (entry.type === 'message' && entry.text) {
              return {
                role: entry.role || 'unknown',
                text: entry.text.substring(0, 200),
                timestamp: entry.timestamp,
              };
            }
          } catch {
            // Skip malformed lines
          }
          return null;
        })
        .filter(Boolean);

      socket.emit('spectate:content', { messages });
    } catch (err) {
      console.error('Error reading spectate content:', err);
      socket.emit('spectate:error', { message: 'Could not load transcript' });
    }
  }

  static stopSpectate(socket: Socket): void {
    socket.emit('spectate:stopped');
  }
}
