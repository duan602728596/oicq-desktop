type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'mark' | 'off';

export interface SystemOptions {
  oicqDataDir: string;
  logLevel?: LogLevel;
}