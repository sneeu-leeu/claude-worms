import { readFileSync } from 'fs';
import type { TranscriptSummary } from '../types.js';

interface TranscriptEntry {
  timestamp?: string;
  type?: string;
  role?: string;
  text?: string;
  tool_name?: string;
  name?: string;
  content?: string;
}

export class TranscriptParser {
  static parseJsonl(filePath: string): TranscriptSummary {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.trim().split('\n').filter(l => l.length > 0);

      let lastMessageText = '';
      let lastToolName: string | undefined;
      let lastActivityTime = Date.now();
      let messageCount = 0;

      for (const line of lines.reverse()) {
        try {
          const entry: TranscriptEntry = JSON.parse(line);

          if (entry.timestamp && !lastActivityTime) {
            lastActivityTime = new Date(entry.timestamp).getTime();
          }

          if (entry.type === 'message') {
            messageCount++;
            if (entry.role === 'assistant' && !lastMessageText && entry.text) {
              // Extract first 100 chars of assistant message
              lastMessageText = entry.text.substring(0, 100);
            }
          }

          if (entry.type === 'tool_use' && !lastToolName && entry.tool_name) {
            lastToolName = entry.tool_name;
          }

          if (lastMessageText && lastToolName) {
            break;
          }
        } catch {
          // Skip malformed lines
          continue;
        }
      }

      return {
        lastMessageText: lastMessageText || 'Waiting for first message...',
        lastToolName,
        lastActivityTime,
        messageCount,
      };
    } catch {
      return {
        lastMessageText: 'No transcript found',
        lastActivityTime: Date.now(),
        messageCount: 0,
      };
    }
  }
}
