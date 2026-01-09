/**
 * Persistent Logger - Logs survive page redirects
 * Stores logs in localStorage so you can see them after redirect
 */

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  data?: any;
}

const LOG_KEY = 'DEBUG_LOGS';
const MAX_LOGS = 100;

export class PersistentLogger {
  private static getLogs(): LogEntry[] {
    if (typeof window === 'undefined') return [];
    try {
      const logs = localStorage.getItem(LOG_KEY);
      return logs ? JSON.parse(logs) : [];
    } catch {
      return [];
    }
  }

  private static saveLogs(logs: LogEntry[]): void {
    if (typeof window === 'undefined') return;
    try {
      // Keep only last MAX_LOGS entries
      const trimmed = logs.slice(-MAX_LOGS);
      localStorage.setItem(LOG_KEY, JSON.stringify(trimmed));
    } catch (e) {
    }
  }

  static log(message: string, data?: any): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      data
    };

    // Console log

    // Persistent log
    const logs = this.getLogs();
    logs.push(entry);
    this.saveLogs(logs);
  }

  static warn(message: string, data?: any): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'warn',
      message,
      data
    };


    const logs = this.getLogs();
    logs.push(entry);
    this.saveLogs(logs);
  }

  static error(message: string, data?: any): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
      data
    };


    const logs = this.getLogs();
    logs.push(entry);
    this.saveLogs(logs);
  }

  static viewLogs(): LogEntry[] {
    const logs = this.getLogs();
    logs.forEach(log => {
      const time = new Date(log.timestamp).toLocaleTimeString();
      const emoji = log.level === 'error' ? '❌' : log.level === 'warn' ? '⚠️' : 'ℹ️';
    });

    return logs;
  }

  static clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(LOG_KEY);
  }

  static exportLogs(): string {
    const logs = this.getLogs();
    return JSON.stringify(logs, null, 2);
  }
}

// Make it globally available
if (typeof window !== 'undefined') {
  (window as any).viewLogs = () => PersistentLogger.viewLogs();
  (window as any).clearLogs = () => PersistentLogger.clear();
  (window as any).exportLogs = () => {
    const logs = PersistentLogger.exportLogs();
    return logs;
  };

}
