import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export class ItermBridge {
  static async getSessionNames(): Promise<Map<string, string>> {
    const script = `
      tell application "iTerm2"
        set sessionMap to ""
        repeat with w in windows
          repeat with t in tabs of w
            repeat with s in sessions of t
              set ttyName to tty of s
              set sessionName to name of s
              set sessionMap to sessionMap & ttyName & "|" & sessionName & "\\n"
            end repeat
          end repeat
        end repeat
        return sessionMap
      end tell
    `;

    try {
      const { stdout } = await execFileAsync('osascript', ['-e', script]);
      const map = new Map<string, string>();
      const lines = stdout.trim().split('\n').filter(l => l.length > 0);

      for (const line of lines) {
        const [tty, name] = line.split('|');
        if (tty && name) {
          map.set(tty.trim(), name.trim());
        }
      }

      return map;
    } catch {
      return new Map();
    }
  }

  static async spawnNewInstance(projectPath: string): Promise<void> {
    const script = `
      tell application "iTerm2"
        create window with default profile
        tell current session of current window
          write text "cd '${projectPath.replace(/'/g, "'\\''")}' && claude"
        end tell
      end tell
    `;

    try {
      await execFileAsync('osascript', ['-e', script]);
    } catch (err) {
      console.error('Failed to spawn new instance:', err);
      throw err;
    }
  }

  static async focusTab(tty: string): Promise<void> {
    const script = `
      tell application "iTerm2"
        repeat with w in windows
          repeat with t in tabs of w
            repeat with s in sessions of t
              if tty of s = "${tty}" then
                select t
                activate
                return
              end if
            end repeat
          end repeat
        end repeat
      end tell
    `;

    try {
      await execFileAsync('osascript', ['-e', script]);
    } catch (err) {
      console.error('Failed to focus tab:', err);
    }
  }
}
