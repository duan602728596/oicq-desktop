import type { Client } from 'oicq';
import type { Draft } from 'immer';
import type { Dispatch as D, SetStateAction as S, MouseEvent } from 'react';
import type { LogLevel, PluginItem, PluginModule, SystemOptions } from '../../types';

// reducer
export interface QuerySystemOptionsResult {
  query: string;
  result: { name: 'system_options'; value: SystemOptions };
}

// 关闭登陆窗口的方法
export type OnCancelFunc = (event: MouseEvent<HTMLButtonElement>) => void;

// 表单的值
export interface FormValueStore {
  uin: string;
  password: string;
  platform: number;
  remember?: boolean;
  logLevel?: '默认' | LogLevel;
  plugins: Array<string>;
}

// 格式化后的表单的值
export interface LoginFormValue extends Omit<FormValueStore, 'plugins'> {
  uin: number;
  logLevel: LogLevel;
}

// 钩子，可以获取到bot的实例
interface BotHook {
  destroy?(): void;
}

// ctx挂载的对象
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

// 常用账号
export interface AccountItem {
  uin: string;
  password: string;
}

// 已登陆的账号
export interface LoginItem {
  uin: number;
  client: Draft<Client>;
  logLevel: LogLevel;
  plugins: Array<PluginModule>;
}