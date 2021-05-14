import { isFileExists } from '@sweet-milktea/utils';
import { message } from 'antd';
import { pick } from 'lodash-es';
import type { PluginItem } from '../../../types';
import type { LoginContext, LoginFormValue } from '../types';

/**
 * 检查系统配置的路径和插件是否存在
 * 处理表单的值
 */
async function formValueMiddleware(ctx: LoginContext, next: Function): Promise<void> {
  const { formValue, pluginsList, systemOptions }: LoginContext = ctx;

  // 检查系统配置
  if (!(await isFileExists(systemOptions?.oicqDataDir))) {
    return message.warn('请先去配置oicq的数据存储文件夹！');
  }

  // 检查插件
  const usePluginsList: Array<PluginItem> = [];

  for (const plugin of pluginsList) {
    if (formValue.plugins.includes(plugin.id)) {
      const hasPlugin: boolean = await isFileExists(plugin.path);

      if (hasPlugin) {
        usePluginsList.push(plugin);
      } else {
        message.error(`插件：${ plugin.name } 不存在。`);
      }
    }
  }

  ctx.usePluginsList = usePluginsList;

  // 表单配置
  const loginFormValue: LoginFormValue = Object.assign<
    Pick<LoginFormValue, 'password' | 'platform' | 'remember'>,
    Pick<LoginFormValue, 'uin' | 'logLevel'>
  >(
    pick(formValue, ['password', 'platform', 'remember']),
    {
      uin: Number(formValue.uin),
      logLevel: (formValue.logLevel === '默认' ? systemOptions?.logLevel : formValue.logLevel) ?? 'info'
    }
  );

  ctx.loginFormValue = loginFormValue;

  await next();
}

export default formValueMiddleware;