import type { Client } from 'oicq';
import type { Dispatch as D, SetStateAction as S, MouseEvent } from 'react';
import type { LoginItem, LogLevel, PluginItem, PluginModule, SystemOptions } from '../../types';

// reducer
export interface QuerySystemOptionsResult {
  query: string;
  result: { name: 'system_options'; value: SystemOptions };
}

export type OnCancelFunc = (event: MouseEvent<HTMLButtonElement>) => void;

export interface FormValueStore {
  uin: string;
  password: string;
  platform: number;
  remember?: boolean;
  logLevel?: '默认' | LogLevel;
  plugins: Array<string>;
}

// 格式化后的数据
export interface LoginFormValue extends Omit<FormValueStore, 'plugins'> {
  uin: number;
  logLevel: LogLevel;
}

// 钩子，可以获取到bot的实例
interface BotHook {
  destroy?(): void;
}

export interface LoginContext {
  loginList: Array<LoginItem>;
  formValue: FormValueStore;
  onCancel: OnCancelFunc;
  pluginsList: Array<PluginItem>;
  systemOptions: SystemOptions | undefined;
  setLoading: D<S<boolean>>; // 账号登陆时的loading

  // 处理后的值
  loginFormValue: LoginFormValue;
  usePluginsList: Array<PluginItem>;

  // 机器人
  client: Client;
  botHook: BotHook;
  clientPlugins: Array<PluginModule>;
}

export interface AccountItem {
  uin: string;
  password: string;
}