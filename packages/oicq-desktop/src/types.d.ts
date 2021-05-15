import type { Client } from 'oicq';
import type { Draft } from 'immer';

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'mark' | 'off';

export interface SystemOptions {
  oicqDataDir: string;
  browser?: string;
  logLevel?: LogLevel;
}

export interface PluginItem {
  id: string;
  name: string;
  path: string;
  esm?: boolean;
  use?: boolean;
}

// 登陆成功后挂载的实例
export interface PluginModule {
  activate(bot: Client | Draft<Client>): Promise<void>;
  deactivate(bot: Client | Draft<Client>): Promise<void>;
  destructor?(): Promise<void>;
}

export interface LoginItem {
  uin: number;
  client: Draft<Client>;
  logLevel: LogLevel;
  plugins: Array<PluginModule>;
}