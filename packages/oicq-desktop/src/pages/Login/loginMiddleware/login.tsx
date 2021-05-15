import { shell } from 'electron';
import {
  createClient,
  Client,
  SliderEventData,
  DeviceEventData,
  OnlineEventData,
  LoginErrorEventData,
  OfflineEventData
} from 'oicq';
import { useState, ReactElement, Dispatch as D, SetStateAction as S, MouseEvent } from 'react';
import { render } from 'react-dom';
import { Modal, message } from 'antd';
import type { LoginContext, LoginFormValue } from '../types';

let loginDeviceElement: HTMLDivElement | null = null;

/* 登陆账号，创建bot */
function loginMiddleware(ctx: LoginContext, next: Function): void {
  const { systemOptions, loginFormValue, setLoading, botHook }: LoginContext = ctx;

  setLoading(true);

  // 账号登陆
  const bot: Client = createClient(loginFormValue.uin, {
    log_level: loginFormValue.logLevel,
    platform: loginFormValue.platform ?? 2,
    ignore_self: false,
    data_dir: systemOptions!.oicqDataDir
  });

  // 监听验证码
  bot.on('system.login.slider', function(e: SliderEventData): void {
    //
  });

  // 监听设备锁
  bot.on('system.login.device', function(e: DeviceEventData): void {
    // 监听的modal
    function LoginDeviceModal(props: {}): ReactElement {
      const [visible, setVisible]: [boolean, D<S<boolean>>] = useState(true);

      // 关闭modal
      function afterClose(): void {
        loginDeviceElement = null;
      }

      // 取消登陆
      async function handleNoLoginCancel(event: MouseEvent<HTMLButtonElement>): Promise<void> {
        await bot.logout();
        setVisible(false);
        setLoading(false);
      }

      // 确认登陆
      function handleLoginOk(event: MouseEvent<HTMLButtonElement>): void {
        bot.login(loginFormValue.password);
        setVisible(false);
      }

      return (
        <Modal title="设备锁验证"
          visible={ visible }
          width={ 400 }
          centered={ true }
          maskClosable={ false }
          destroyOnClose={ true }
          mask={ false }
          afterClose={ afterClose }
          okText="验证成功，继续登陆"
          cancelText="取消登陆"
          onOk={ handleLoginOk }
          onCancel={ handleNoLoginCancel }
        >
          在浏览器中进行
          <a role="button"
            aria-label="设备锁验证"
            onClick={ (event: MouseEvent<HTMLAnchorElement>): Promise<void> => shell.openExternal(e.url) }
          >
            设备锁验证
          </a>。
        </Modal>
      );
    }

    loginDeviceElement = document.createElement('div');
    render(<LoginDeviceModal />, loginDeviceElement);
    shell.openExternal(e.url);
  });

  // 登陆成功
  bot.on('system.online', function(e: OnlineEventData): void {
    // 模拟个接口 'https://api.bilibili.com/x/web-interface/nav'
  });

  // 登陆失败
  bot.on('system.login.error', function(e: LoginErrorEventData): void {
    message.error(e.message);
    bot.logout();
    setLoading(false);
  });

  // 被下线
  bot.on('system.offline', function(e: OfflineEventData): void {
    message.error(e.message);
    bot.logout();
    setLoading(false);
  });

  botHook.destroy = function(): void {
    bot.logout();
  };

  bot.login(loginFormValue.password);
  ctx.client = bot;
}

export default loginMiddleware;