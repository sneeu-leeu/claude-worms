export type WormStatus = 'active' | 'idle' | 'sleeping' | 'dead' | 'waiting';

export interface WormInstance {
  pid: number;
  sessionId: string;
  cwd: string;
  startedAt: number;
  tty: string;
  currentTask: string;
  lastActivity: number;
  health: number;
  status: WormStatus;
  lastOutput: string;
  messageCount: number;
  uptime: number;
}

export interface SystemState {
  load1: number;
  load5: number;
  load15: number;
  uptime: number;
  weatherState: 'clear' | 'cloudy' | 'storm';
}
