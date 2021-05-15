import { requireModuleWithoutCache } from '@sweet-milktea/utils';
import { importESM } from '../../../utils/utils';
import type { PluginModule } from '../../../types';
import type { LoginContext } from '../types';

/* 登陆成功后加载插件 */
async function pluginsMiddleware(ctx: LoginContext, next: Function): Promise<void> {
  const { usePluginsList, client }: LoginContext = ctx;
  const clientPlugins: Array<PluginModule> = [];

  for (const plugin of usePluginsList) {
    const module: PluginModule = plugin.esm
      ? await importESM(`${ plugin.path }?t=${ new Date().getTime() }`)
      : await requireModuleWithoutCache(plugin.path, true);

    if (typeof module.activate === 'function') {
      try {
        await module.activate(client);
        clientPlugins.push(module);
      } catch (err) {
        console.error(plugin.name, err);
      }
    }
  }

  ctx.clientPlugins = clientPlugins;
  await next();
}

export default pluginsMiddleware;