import { randomUUID } from 'crypto';
import type { OpenDialogReturnValue } from 'electron';
import { dialog } from '@electron/remote';
import { useEffect, ReactElement, MouseEvent } from 'react';
import * as PropTypes from 'prop-types';
import type { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import { Modal, Form, Input, Button, Switch, message, FormInstance } from 'antd';
import classNames from 'classnames';
import { omit } from 'lodash-es';
import style from './pluginModal.sass';
import { saveAPlugin } from './reducers/reduces';
import type { PluginItem } from '../../types';

interface PluginModalProps {
  visible: boolean;
  item?: PluginItem;
  onCancel: (event: MouseEvent<HTMLButtonElement>) => void;
}

/* 添加或修改插件的表单 */
function PluginModal(props: PluginModalProps): ReactElement {
  const { visible, item, onCancel }: PluginModalProps = props;
  const dispatch: Dispatch = useDispatch();
  const [form]: [FormInstance<PluginItem>] = Form.useForm();
  const { setFieldsValue, validateFields, resetFields }: FormInstance<PluginItem> = form;

  // 提交
  async function handleEditClick(event: MouseEvent<HTMLButtonElement>): Promise<void> {
    let formValue: PluginItem;

    try {
      formValue = await validateFields();
    } catch {
      return;
    }

    if (item) {
      formValue.id = item.id;
    } else {
      formValue.id = randomUUID();
      formValue.use = true;
    }

    await dispatch(saveAPlugin({
      data: formValue
    }));
    message.success(`${ item ? '保存' : '添加' }成功！`);
    onCancel(event);
  }

  // 添加或修改数据
  async function handleSelectPathClick(event: MouseEvent<HTMLButtonElement>): Promise<void> {
    const result: OpenDialogReturnValue = await dialog.showOpenDialog({
      properties: ['openDirectory', 'openFile']
    });

    if (result.canceled || !result.filePaths || result.filePaths.length === 0) return;

    setFieldsValue({ path: result.filePaths[0] });
  }

  useEffect(function() {
    if (visible && item) {
      setFieldsValue(omit(item, ['id']));
    }
  }, [visible, item]);

  return (
    <Modal title="添加插件"
      visible={ visible }
      width={ 500 }
      centered={ true }
      maskClosable={ false }
      destroyOnClose={ true }
      afterClose={ resetFields }
      onOk={ handleEditClick }
      onCancel={ onCancel }
    >
      <Form className={ style.form } form={ form } labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
        <Form.Item name="name" label="插件名称" rules={ [{ required: true, message: '请填写插件名称', whitespace: true }] }>
          <Input />
        </Form.Item>
        <Form.Item label="插件地址" required={ true }>
          <div className={ style.flexLayout }>
            <div className={ style.flexAuto }>
              <Form.Item name="path" rules={ [{ required: true, message: '请选择插件地址', whitespace: true }] } noStyle={ true }>
                <Input allowClear={ true } />
              </Form.Item>
            </div>
            <div className={ classNames(style.flexFixed, style.marginLeft8) }>
              <Button onClick={ handleSelectPathClick }>插件地址</Button>
            </div>
          </div>
        </Form.Item>
        <Form.Item name="esm" label="esm方式加载插件" valuePropName="checked" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
          <Switch />
        </Form.Item>
        {
          item && (
            <Form.Item name="use" label="开启插件" valuePropName="checked" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
              <Switch />
            </Form.Item>
          )
        }
      </Form>
    </Modal>
  );
}

PluginModal.propTypes = {
  visible: PropTypes.bool,
  item: PropTypes.object,
  onCancel: PropTypes.func
};

export default PluginModal;