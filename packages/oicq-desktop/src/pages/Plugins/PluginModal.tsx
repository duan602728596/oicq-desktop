import type { ReactElement } from 'react';
import * as PropTypes from 'prop-types';
import { Modal, Form, Input, Button, Switch, FormInstance } from 'antd';
import classNames from 'classnames';
import style from './pluginModal.sass';
import type { PluginItem } from '../../types';

interface PluginModalProps {
  visible: boolean;
  item?: PluginItem;
}

/* 添加或修改插件的表单 */
function PluginModal(props: PluginModalProps): ReactElement {
  const { visible, item }: PluginModalProps = props;
  const [form]: [FormInstance<PluginItem>] = Form.useForm();

  return (
    <Modal title="添加插件"
      visible={ visible }
      width={ 500 }
      centered={ true }
      maskClosable={ false }
      destroyOnClose={ true }
    >
      <Form className={ style.form } form={ form } labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
        <Form.Item name="name" label="插件名称" rules={ [{ required: true, message: '请填写插件名称', whitespace: true }] }>
          <Input />
        </Form.Item>
        <Form.Item label="插件地址">
          <div className={ style.flexLayout }>
            <div className={ style.flexAuto }>
              <Form.Item name="path" noStyle={ true }>
                <Input />
              </Form.Item>
            </div>
            <div className={ classNames(style.flexFixed, style.marginLeft8) }>
              <Button>插件地址</Button>
            </div>
          </div>
        </Form.Item>
        <Form.Item name="esm" label="esm方式加载插件" valuePropName="checked" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
}

PluginModal.propTypes = {
  visible: PropTypes.bool,
  item: PropTypes.object
};

export default PluginModal;