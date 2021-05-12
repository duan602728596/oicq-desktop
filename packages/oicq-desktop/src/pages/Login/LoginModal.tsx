import { useEffect, useMemo, ReactElement, MouseEvent } from 'react';
import * as PropTypes from 'prop-types';
import type { Dispatch } from 'redux';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector, createStructuredSelector, Selector } from 'reselect';
import { Modal, Form, Input, Radio, Transfer, Checkbox, FormInstance } from 'antd';
import type { TransferItem } from 'antd/es/transfer';
import style from './loginModal.sass';
import { logLevel } from '../SystemOptions';
import { queryPluginsList, PluginsInitialState } from '../Plugins/reducers/reduces';
import dbConfig from '../../utils/idb/dbConfig';
import type { LogLevel, PluginItem } from '../../types';

const loginLogLevel: Array<'默认' | LogLevel> = ['默认', ...logLevel];

interface LoginModalProps {
  visible: boolean; // 弹出层的显示隐藏
  onCancel: (event: MouseEvent<HTMLButtonElement>) => void;
}

/* redux selector */
type RSelector = PluginsInitialState;

const selector: Selector<any, RSelector> = createStructuredSelector({
  // 插件列表
  pluginsList: createSelector(
    ({ plugins }: { plugins: PluginsInitialState }): Array<PluginItem> => plugins.pluginsList,
    (data: Array<PluginItem>): Array<PluginItem> => (data)
  )
});

/* 账号登陆 */
function LoginModal(props: LoginModalProps): ReactElement {
  const { visible, onCancel }: LoginModalProps = props;
  const { pluginsList }: RSelector = useSelector(selector);
  const dispatch: Dispatch = useDispatch();
  const [form]: [FormInstance] = Form.useForm();
  const { resetFields }: FormInstance = form;

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

  useEffect(function(): void {
    dispatch(queryPluginsList({
      query: {
        indexName: dbConfig.objectStore[1].data[0]
      }
    }));
  }, []);

  return (
    <Modal title="账号登陆"
      visible={ visible }
      width={ 800 }
      bodyStyle={{ padding: '16px' }}
      centered={ true }
      maskClosable={ false }
      destroyOnClose={ true }
      afterClose={ resetFields }
      onCancel={ onCancel }
    >
      <Form className={ style.form }
        form={ form }
        initialValues={{ logLevel: '默认', plugins: defaultTransferPluginsList }}
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 21 }}
      >
        <Form.Item name="uin" label="账号" rules={ [{ required: true, message: '请填写账号', whitespace: true }] }>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="密码" rules={ [{ required: true, message: '请输入密码', whitespace: true }] }>
          <Input.Password />
        </Form.Item>
        <Form.Item name="remember" label="记住账号信息" valuePropName="checked">
          <Checkbox />
        </Form.Item>
        <Form.Item name="logLevel" label="默认日志等级">
          <Radio.Group options={ loginLogLevel } />
        </Form.Item>
        <Form.Item name="plugins" label="加载插件" valuePropName="targetKeys">
          <Transfer className={ style.transfer }
            titles={ ['未加载插件', '已加载插件'] }
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