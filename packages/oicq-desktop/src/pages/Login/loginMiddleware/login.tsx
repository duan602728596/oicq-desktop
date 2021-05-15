import { shell } from 'electron';
import * as puppeteer from 'puppeteer-core';
import type { Browser, Page, HTTPResponse } from 'puppeteer-core';
import { isFileExists } from '@sweet-milktea/utils';
import {
  createClient,
  Client,
  SliderEventData,
  DeviceEventData,
  OnlineEventData,
  LoginErrorEventData,
  OfflineEventData
} from 'oicq';
import { useState, useEffect, ReactElement, Dispatch as D, SetStateAction as S, MouseEvent } from 'react';
import { render } from 'react-dom';
import { Modal, message, Input } from 'antd';
import type { LoginContext, LoginFormValue } from '../types';

let loginDeviceElement: HTMLDivElement | null = null;
let loginSliderElement: HTMLDivElement | null = null;
let browser: Browser | null = null;

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
    // 监听的modal
    function LoginSliderModal(props: {}): ReactElement {
      const [visible, setVisible]: [boolean, D<S<boolean>>] = useState(true);
      const [ticket, setTicket]: [string, D<S<string>>] = useState(''); // 滑动验证码

      // 打开浏览器并监听获取到的ticket
      async function openSliderPage(): Promise<void> {
        if (browser !== null) return;

        if (await isFileExists(systemOptions?.browser)) {
          try {
            browser = await puppeteer.launch({
              headless: false,
              executablePath: systemOptions?.browser,
              defaultViewport: {
                width: 300,
                height: 200
              }
            });

            const page: Page = await browser.newPage();

            page.on('response', async function(res: HTTPResponse): Promise<void> {
              const uri: string = res.url();

              if (uri.includes('cap_union_new_verify')) {
                const json: { ticket: string } = await res.json();

                setTicket(json.ticket);
              }
            });

            page.on('close', function(): void {
              browser?.close();
              browser = null;
            });

            await page.goto(e.url);
          } catch (err) {
            console.error(err);
            browser?.close();
            browser = null;
          }
        } else {
          shell.openExternal(e.url);
        }
      }

      // 打开无头浏览器
      function handleOpenSliderPageClick(event: MouseEvent<HTMLAnchorElement>): void {
        openSliderPage();
      }

      // 关闭modal
      function afterClose(): void {
        loginSliderElement = null;
      }

      // 取消登陆
      async function handleNoLoginCancel(event: MouseEvent<HTMLButtonElement>): Promise<void> {
        await bot.logout();
        setVisible(false);
        setLoading(false);
      }

      // 确认登陆
      function handleLoginOk(event: MouseEvent<HTMLButtonElement>): void {
        bot.sliderLogin(ticket);
        setVisible(false);
      }

      useEffect(function(): void {
        openSliderPage();
      }, []);

      return (
        <Modal title="滑动验证码验证"
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
          <p>
            在浏览器中进行
            <a role="button" aria-label="滑动验证码验证" onClick={ handleOpenSliderPageClick }>滑动验证码验证</a>。
          </p>
          <div>
            <Input addonBefore="ticket" />
          </div>
        </Modal>
      );
    }

    loginSliderElement = document.createElement('div');
    render(<LoginSliderModal />, loginSliderElement);
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
          <p>
            在浏览器中进行
            <a role="button"
              aria-label="设备锁验证"
              onClick={ (event: MouseEvent<HTMLAnchorElement>): Promise<void> => shell.openExternal(e.url) }
            >
              设备锁验证
            </a>。
          </p>
        </Modal>
      );
    }

    loginDeviceElement = document.createElement('div');
    render(<LoginDeviceModal />, loginDeviceElement);
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