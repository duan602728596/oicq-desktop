import { shell } from 'electron';
import type { SliderEventData, Client } from 'oicq';
import * as puppeteer from 'puppeteer-core';
import type { Browser, Page, HTTPResponse } from 'puppeteer-core';
import { isFileExists } from '@sweet-milktea/utils';
import { useState, useEffect, ReactElement, Dispatch as D, SetStateAction as S, MouseEvent, ChangeEvent } from 'react';
import * as PropTypes from 'prop-types';
import { Input, Modal } from 'antd';
import type { SystemOptions } from '../../../../types';

let browser: Browser | null = null;

interface LoginSliderModalProps {
  systemOptions: SystemOptions | undefined;
  sliderEvent: SliderEventData;
  bot: Client;
  setLoading: D<S<boolean>>;
  afterClose(): void;
}

/* 监听验证码 */
function LoginSliderModal(props: LoginSliderModalProps): ReactElement {
  const { systemOptions, sliderEvent, bot, setLoading, afterClose }: LoginSliderModalProps = props;
  const [visible, setVisible]: [boolean, D<S<boolean>>] = useState(true);
  const [ticket, setTicket]: [string, D<S<string>>] = useState(''); // 滑动验证码

  // 打开浏览器并监听获取到的ticket
  async function openSliderPage(): Promise<void> {
    if (browser !== null) return;

    if (systemOptions?.browser && await isFileExists(systemOptions.browser)) {
      try {
        browser = await puppeteer.launch({
          headless: false,
          executablePath: systemOptions.browser,
          defaultViewport: {
            width: 400,
            height: 300
          }
        });

        const page: Page = await browser.newPage();

        page.on('response', async function(res: HTTPResponse): Promise<void> {
          const uri: string = res.url();

          // https://t.captcha.qq.com/cap_union_new_verify
          if (uri.includes('cap_union_new_verify')) {
            const json: { ticket: string } = await res.json();

            setTicket(json.ticket);
          }
        });

        page.on('close', function(): void {
          browser?.close();
          browser = null;
        });

        await page.goto(sliderEvent.url);
      } catch (err) {
        console.error(err);
        browser?.close();
        browser = null;
      }
    } else {
      shell.openExternal(sliderEvent.url);
    }
  }

  // 打开无头浏览器
  function handleOpenSliderPageClick(event: MouseEvent<HTMLAnchorElement>): void {
    openSliderPage();
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

  // 同步input
  function handleInputChange(event: ChangeEvent): void {
    setVisible(event.target['value']);
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
        <Input addonBefore="ticket" value={ ticket } onChange={ handleInputChange } />
      </div>
    </Modal>
  );
}

LoginSliderModal.propTypes = {
  systemOptions: PropTypes.object,
  sliderEvent: PropTypes.object,
  bot: PropTypes.object,
  setLoading: PropTypes.func,
  afterClose: PropTypes.func
};

export default LoginSliderModal;