import { shell } from 'electron';
import type { Client, DeviceEventData } from 'oicq';
import * as puppeteer from 'puppeteer-core';
import type { Browser, Page, HTTPRequest } from 'puppeteer-core';
import { isFileExists } from '@sweet-milktea/utils';
import { useState, useEffect, ReactElement, Dispatch as D, SetStateAction as S, MouseEvent } from 'react';
import * as PropTypes from 'prop-types';
import { Modal } from 'antd';
import qqapi from 'raw-loader!./qqapi.wk.js';
import type { LoginFormValue } from '../../types';
import type { SystemOptions } from '../../../../types';

let browser: Browser | null = null;

interface LoginDeviceModalProps {
  systemOptions: SystemOptions | undefined;
  loginFormValue: LoginFormValue;
  deviceEvent: DeviceEventData;
  bot: Client;
  setLoading: D<S<boolean>>;
  afterClose(): void;
}

/* 监听设备锁 */
function LoginDeviceModal(props: LoginDeviceModalProps): ReactElement {
  const { systemOptions, loginFormValue, deviceEvent, bot, setLoading, afterClose }: LoginDeviceModalProps = props;
  const [visible, setVisible]: [boolean, D<S<boolean>>] = useState(true);

  // 打开浏览器
  async function openDevicePage(): Promise<void> {
    if (browser !== null) return;

    if (systemOptions?.browser && await isFileExists(systemOptions.browser)) {
      try {
        browser = await puppeteer.launch({
          headless: false,
          executablePath: systemOptions.browser,
          defaultViewport: {
            width: 600,
            height: 400
          }
        });

        const page: Page = await browser.newPage();

        await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) '
          + 'AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/18F72 QQ/8.8.0.608 V1_IPH_SQ_8.8.0_1_APP_A Pixel/828 '
          + 'SimpleUISwitch/0 StudyMode/0 QQTheme/1000 Core/WKWebView Device/Apple(iPhone XR) '
          + 'NetType/WIFI QBWebViewType/1 WKType/1');
        await page.setCacheEnabled(false);
        await page.setRequestInterception(true);

        page.on('request', async function(req: HTTPRequest): Promise<void> {
          if (/qqapi\.wk/i.test(req.url())) {
            await req.respond({
              status: 200,
              contentType: 'application/javascript; charset=utf-8',
              body: qqapi
            });
          } else {
            await req.continue();
          }
        });

        page.on('close', function(): void {
          browser?.close();
          browser = null;
        });

        await page.goto(deviceEvent.url, {
          referer: deviceEvent.url
        });
      } catch (err) {
        console.error(err);
        browser?.close();
        browser = null;
      }
    } else {
      shell.openExternal(deviceEvent.url);
    }
  }

  // 打开无头浏览器
  function handleOpenDevicePageClick(event: MouseEvent<HTMLAnchorElement>): void {
    openDevicePage();
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

  useEffect(function(): void {
    openDevicePage();
  }, []);

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
        <a role="button" aria-label="设备锁验证" onClick={ handleOpenDevicePageClick }>设备锁验证</a>。
      </p>
    </Modal>
  );
}

LoginDeviceModal.propTypes = {
  loginFormValue: PropTypes.object,
  deviceEvent: PropTypes.object,
  bot: PropTypes.object,
  setLoading: PropTypes.func,
  afterClose: PropTypes.func
};

export default LoginDeviceModal;