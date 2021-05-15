import type { Client } from 'oicq';
import type { Draft } from 'immer';

// 日志等级
export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'mark' | 'off';

// 系统配置
export interface SystemOptions {
  oicqDataDir: string; // oicq的目录
  browser?: string;    // 无头浏览器的地址
  logLevel?: LogLevel; // 日志等级
}

// 插件
export interface PluginItem {
  id: string;    // 插件id
  name: string;  // 插件名称
  path: string;  // 插件路径
  esm?: boolean; // 插件以esm方式加载
  use?: boolean; // 插件启用
}