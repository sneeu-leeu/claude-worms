import { homedir } from 'os';
import { join } from 'path';

const CLAUDE_HOME = join(homedir(), '.claude');
const SESSIONS_DIR = join(CLAUDE_HOME, 'sessions');
const PROJECTS_DIR = join(CLAUDE_HOME, 'projects');

export const config = {
  CLAUDE_HOME,
  SESSIONS_DIR,
  PROJECTS_DIR,
  PORT: 4242,
  ITERM_POLL_INTERVAL: 5000, // 5 seconds
  PROCESS_MONITOR_INTERVAL: 3000, // 3 seconds
  SYSTEM_WEATHER_INTERVAL: 10000, // 10 seconds
  IDLE_THRESHOLD: 30000, // 30 seconds to go from active to idle
  SLEEP_THRESHOLD: 300000, // 5 minutes to go from idle to sleeping
};

export function encodeCwd(cwd: string): string {
  return cwd.replace(/\//g, '-').replace(/^-/, '');
}

export function decodeCwd(encoded: string): string {
  return '/' + encoded.split('-').join('/');
}
