import type { Client, FriendInfo, StrangerInfo, GroupInfo, MemberInfo } from 'oicq';
import type OicqServer from './OicqServer';

export interface ServerMapsItem {
  bot: Client;
  server: OicqServer;
}

/* 配置类型 */
export interface ConfigItem {
  uin: number;
  port: number;
}

export interface ServerPluginConfig {
  config: Array<ConfigItem>;
}

export type InfoItem = FriendInfo | StrangerInfo | GroupInfo | MemberInfo;
export type GmlItem = [number, Array<MemberInfo>];