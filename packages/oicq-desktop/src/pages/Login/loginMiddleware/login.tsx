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
import { render } from 'react-dom';
import { message } from 'antd';
import LoginDeviceModal from './login/LoginDeviceModal';
import LoginSliderModal from './login/LoginSliderModal';
import type { LoginContext } from '../types';

let loginDeviceElement: HTMLDivElement | null = null;
let loginSliderElement: HTMLDivElement | null = null;

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
    loginSliderElement = document.createElement('div');
    render(
      <LoginSliderModal systemOptions={ systemOptions }
        sliderEvent={ e }
        bot={ bot }
        setLoading={ setLoading }
        afterClose={ (): null => loginSliderElement = null }
      />,
      loginSliderElement
    );
  });

  // 监听设备锁
  bot.on('system.login.device', function(e: DeviceEventData): void {
    loginDeviceElement = document.createElement('div');
    render(
      <LoginDeviceModal loginFormValue={ loginFormValue }
        deviceEvent={ e }
        bot={ bot }
        setLoading={ setLoading }
        afterClose={ (): null => loginDeviceElement = null }
      />,
      loginDeviceElement
    );
    shell.openExternal(e.url);
  });

  // 登陆成功
  bot.on('system.online', function(e: OnlineEventData): void {
    next();
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

  // 添加hook方法供外部调用
  botHook.destroy = function(): void {
    bot.logout();
  };

  bot.login(loginFormValue.password);
  ctx.client = bot;
}

export default loginMiddleware;