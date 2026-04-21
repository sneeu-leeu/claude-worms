export type WormStatus = 'active' | 'idle' | 'sleeping' | 'dead' | 'waiting';

export interface WormInstance {
  pid: number;
  sessionId: string;
  cwd: string;
  startedAt: number;
  tty?: string;
  currentTask: string;
  lastActivity: number;
  health: number; // 0-100
  status: WormStatus;
  lastOutput: string;
  messageCount: number;
  uptime: number; // milliseconds
}

export interface TranscriptSummary {
  lastMessageText: string;
  lastToolName?: string;
  lastActivityTime: number;
  messageCount: number;
}

export interface SessionFile {
  pid: number;
  sessionId: string;
  cwd: string;
  startedAt: number;
  kind: string;
  entrypoint: string;
  tty?: string;
}

export interface SocketEvents {
  'worm:spawned': WormInstance;
  'worm:died': { pid: number; sessionId: string };
  'worm:activity': {
    pid: number;
    lastOutput: string;
    health: number;
    status: WormStatus;
    currentTask: string;
  };
  'system:weather': {
    loadAvg: number;
    weatherState: 'clear' | 'cloudy' | 'storm';
  };
}
