import type { Client } from 'oicq';

export function activate(bot: Client): void {
  console.info('%c 插件加载：oicq-server-plugin ', 'background-color: #fa8c16; color: #fff;');
}

export function deactivate(bot: Client): void {
  console.info('%c 插件卸载：oicq-server-plugin ', 'background-color: #fa8c16; color: #fff;');
}