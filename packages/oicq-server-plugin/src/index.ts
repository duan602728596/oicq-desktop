import type { Client } from 'oicq';
import * as _ from 'lodash';
import OicqServer from './OicqServer';
import serverPluginConfig from '../server-plugin.config';
import type { ServerMapsItem, ConfigItem } from './types';

const config: Array<ConfigItem> = serverPluginConfig.config ?? []; // 配置
const serverMaps: Array<ServerMapsItem> = []; // 保存bot和server

export function activate(bot: Client): void {
  console.info('%c 插件加载：oicq-server-plugin ', 'background-color: #fa8c16; color: #fff;');

  // 判断是否已加载
  const index: number = _.findIndex(serverMaps, (o: ServerMapsItem): boolean => o.bot.uin === bot.uin);

  if (index >= 0) return;

  // 获取配置
  const uinConfig: ConfigItem | undefined = config.find((o: ConfigItem): boolean => o.uin === bot.uin);

  if (!uinConfig) return;

  // 创建服务
  const server: OicqServer = new OicqServer({
    bot,
    port: uinConfig.port
  });

  serverMaps.push({ bot, server });
  server.init();
}

export function deactivate(bot: Client): void {
  console.info('%c 插件卸载：oicq-server-plugin ', 'background-color: #fa8c16; color: #fff;');

  // 关闭服务
  const index: number = _.findIndex(serverMaps, (o: ServerMapsItem): boolean => o.bot.uin === bot.uin);

  if (index >= 0) {
    serverMaps[index].server.destroy();
    serverMaps.splice(index, 1);
  }
}