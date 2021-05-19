import { shell } from 'electron';
import type { Client, DeviceEventData } from 'oicq';
import { useState, useEffect, ReactElement, Dispatch as D, SetStateAction as S, MouseEvent, ChangeEvent } from 'react';
import { Modal } from 'antd';
import type { LoginFormValue } from '../../types';

interface LoginDeviceModalProps {
  loginFormValue: LoginFormValue;
  deviceEvent: DeviceEventData;
  bot: Client;
  setLoading: D<S<boolean>>;
  afterClose(): void;
}

/* 监听设备锁 */
function LoginDeviceModal(props: LoginDeviceModalProps): ReactElement {
  const { loginFormValue, deviceEvent, bot, setLoading, afterClose }: LoginDeviceModalProps = props;
  const [visible, setVisible]: [boolean, D<S<boolean>>] = useState(true);

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
          onClick={ (event: MouseEvent<HTMLAnchorElement>): Promise<void> => shell.openExternal(deviceEvent.url) }
        >
          设备锁验证
        </a>。
      </p>
    </Modal>
  );
}

export default LoginDeviceModal;