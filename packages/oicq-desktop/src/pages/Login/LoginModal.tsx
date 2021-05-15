import { Client } from 'oicq';
import { useState, useEffect, useMemo, ReactElement, Dispatch as D, SetStateAction as S, MouseEvent } from 'react';
import * as PropTypes from 'prop-types';
import type { Dispatch } from 'redux';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector, createStructuredSelector, Selector } from 'reselect';
import { Modal, Form, Input, Radio, Transfer, Checkbox, FormInstance } from 'antd';
import type { TransferItem } from 'antd/es/transfer';
import { Onion } from '@bbkkbkk/q';
import { logLevel } from '../SystemOptions';
import { queryPluginsList, PluginsInitialState } from '../Plugins/reducers/reduces';
import { getSystemOptionsValue, LoginInitialState } from './reducers/reducers';
import dbConfig from '../../utils/idb/dbConfig';
import formValueMiddleware from './loginMiddleware/formValue';
import loginMiddleware from './loginMiddleware/login';
import type { LogLevel, PluginItem, SystemOptions } from '../../types';
import type { OnCancelFunc, FormValueStore, BotHook } from './types';

const loginLogLevel: Array<'默认' | LogLevel> = ['默认', ...logLevel];
// 登陆设备 1:安卓手机(默认) 2:aPad 3:安卓手表 4:MacOS 5:iPad
const platformOptions: Array<{ value: number; label: string }> = [
  { value: 1, label: '安卓手机' },
  { value: 2, label: '安卓平板' },
  { value: 3, label: '安卓手表' },
  { value: 4, label: 'MacOS' },
  { value: 5, label: 'iPad' }
];

interface LoginModalProps {
  visible: boolean; // 弹出层的显示隐藏
  onCancel: OnCancelFunc;
}

const botHook: BotHook = {};

/* redux selector */
type RSelector = PluginsInitialState & Pick<LoginInitialState, 'systemOptions'>;

const selector: Selector<any, RSelector> = createStructuredSelector({
  // 插件列表
  pluginsList: createSelector(
    ({ plugins }: { plugins: PluginsInitialState }): Array<PluginItem> => plugins.pluginsList,
    (data: Array<PluginItem>): Array<PluginItem> => data
  ),

  // 系统配置
  systemOptions: createSelector(
    ({ login }: { login: LoginInitialState }): SystemOptions | undefined => login.systemOptions,
    (data: SystemOptions | undefined): SystemOptions | undefined => data
  )
});

/* 账号登陆 */
function LoginModal(props: LoginModalProps): ReactElement {
  const { visible, onCancel }: LoginModalProps = props;
  const { pluginsList, systemOptions }: RSelector = useSelector(selector);
  const dispatch: Dispatch = useDispatch();
  const [loading, setLoading]: [boolean, D<S<boolean>>] = useState(false); // 登陆后的loading
  const [form]: [FormInstance<FormValueStore>] = Form.useForm();
  const { validateFields, resetFields }: FormInstance<FormValueStore> = form;

  // 插件列表
  const [transferPluginsList, defaultTransferPluginsList]: [Array<TransferItem>, Array<string>]
    = useMemo(function(): [Array<TransferItem>, Array<string>] {
      const l: Array<TransferItem> = [];
      const r: Array<string> = [];

      pluginsList.forEach((item: PluginItem): void => {
        l.push({
          key: item.id,
          title: item.name
        });

        if (item.use) {
          r.push(item.id);
        }
      });

      return [l, r];
    }, [pluginsList]);

  // 点击登陆
  async function handleLoginClick(event: MouseEvent<HTMLButtonElement>): Promise<void> {
    let formValue: FormValueStore;

    try {
      formValue = await validateFields();
    } catch {
      return;
    }

    const onion: Onion = new Onion();

    onion.use(formValueMiddleware);
    onion.use(loginMiddleware);
    onion.run({
      formValue,
      onCancel,
      pluginsList,
      systemOptions,
      setLoading,
      botHook
    });
  }

  // 关闭时需要销毁登陆的bot
  function handleCloseClick(event: MouseEvent<HTMLButtonElement>): void {
    botHook.destroy?.();
    onCancel(event);
    setLoading(false);
  }

  useEffect(function(): void {
    dispatch(queryPluginsList({
      query: {
        indexName: dbConfig.objectStore[1].data[0]
      }
    }));
  }, []);

  useEffect(function(): void {
    dispatch(getSystemOptionsValue({
      query: 'system_options'
    }));
  }, []);

  return (
    <Modal title="账号登陆"
      visible={ visible }
      width={ 600 }
      bodyStyle={{ height: '400px', overflow: 'auto' }}
      centered={ true }
      maskClosable={ false }
      destroyOnClose={ true }
      confirmLoading={ loading }
      afterClose={ resetFields }
      onOk={ handleLoginClick }
      onCancel={ handleCloseClick }
    >
      <Form form={ form }
        initialValues={{ logLevel: '默认', plugins: defaultTransferPluginsList, platform: 2 }}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
      >
        <Form.Item name="uin" label="账号" rules={ [{ required: true, message: '请填写账号', whitespace: true }] }>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="密码" rules={ [{ required: true, message: '请输入密码', whitespace: true }] }>
          <Input.Password />
        </Form.Item>
        <Form.Item name="platform" label="登陆设备">
          <Radio.Group options={ platformOptions } optionType="button" buttonStyle="solid" />
        </Form.Item>
        <Form.Item name="remember" label="记住账号信息" valuePropName="checked">
          <Checkbox />
        </Form.Item>
        <Form.Item name="logLevel" label="默认日志等级">
          <Radio.Group options={ loginLogLevel } />
        </Form.Item>
        <Form.Item name="plugins" label="加载插件" valuePropName="targetKeys">
          <Transfer titles={ ['未加载插件', '已加载插件'] }
            dataSource={ transferPluginsList }
            render={ (record: TransferItem): string => record.title! }
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

LoginModal.propTypes = {
  visible: PropTypes.bool,
  onCancel: PropTypes.func
};

export default LoginModal;