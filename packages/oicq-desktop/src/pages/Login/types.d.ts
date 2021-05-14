import type { MouseEvent } from 'react';
import type { LogLevel, PluginItem, SystemOptions } from '../../types';

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
export interface LoginFormValue extends FormValueStore {
  uin: number;
  logLevel: '默认' | LogLevel;
}

export interface LoginContext {
  formValue: FormValueStore;
  loginFormValue: LoginFormValue;
  onCancel: OnCancelFunc;
  pluginsList: Array<PluginItem>;
}