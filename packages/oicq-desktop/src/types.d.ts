import type { Client } from 'oicq';

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'mark' | 'off';

export interface SystemOptions {
  oicqDataDir: string;
  logLevel?: LogLevel;
}

export interface PluginItem {
  id: string;
  name: string;
  path: string;
  esm?: boolean;
  use?: boolean;
}

export interface LoginItem {
  uin: number;
  client: Client;
  logLevel: LogLevel;
}