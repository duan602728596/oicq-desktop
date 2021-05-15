import type { OpenDialogReturnValue } from 'electron';
import { dialog } from '@electron/remote';
import { useEffect, ReactElement, MouseEvent } from 'react';
import type { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Divider, Radio, message, FormInstance } from 'antd';
import classNames from 'classnames';
import style from './index.sass';
import { saveSystemOptionsValue, getSystemOptionsValue } from './reducers/reducers';
import type { SystemOptions, LogLevel } from '../../types';

export const logLevel: Array<LogLevel> = ['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'mark', 'off'];

/* 系统配置 */
function Index(props: {}): ReactElement {
  const dispatch: Dispatch = useDispatch();
  const [form]: [FormInstance<SystemOptions>] = Form.useForm();
  const { setFieldsValue }: FormInstance<SystemOptions> = form;

  // 获取初始值
  async function getFormValue(): Promise<void> {
    const data: {
      query: string;
      result: { name: 'system_options'; value: SystemOptions };
    } = await dispatch(getSystemOptionsValue({
      query: 'system_options'
    }));

    setFieldsValue(data?.result?.value);
  }

  // 保存
  async function handleFormSubmit(value: SystemOptions): Promise<void> {
    await dispatch(saveSystemOptionsValue({
      data: {
        name: 'system_options',
        value
      }
    }));
    message.success('系统配置保存成功！');
  }

  // 选择数据存储文件夹文件夹的位置
  async function handleSelectOicqDataDirClick(event: MouseEvent<HTMLButtonElement>): Promise<void> {
    const result: OpenDialogReturnValue = await dialog.showOpenDialog({
      properties: ['openDirectory']
    });

    if (result.canceled || !result.filePaths || result.filePaths.length === 0) return;

    setFieldsValue({
      oicqDataDir: result.filePaths[0]
    });
  }

  // 选择浏览器
  async function handleBrowserFileClick(event: MouseEvent<HTMLButtonElement>): Promise<void> {
    const result: OpenDialogReturnValue = await dialog.showOpenDialog({
      properties: ['openFile']
    });

    if (result.canceled || !result.filePaths || result.filePaths.length === 0) return;

    setFieldsValue({
      browser: result.filePaths[0]
    });
  }

  useEffect(function(): void {
    getFormValue();
  }, []);

  return (
    <Form className={ style.content }
      form={ form }
      initialValues={{ logLevel: 'info' }}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      onFinish={ handleFormSubmit }
    >
      <Form.Item label="数据存储文件夹" required={ true }>
        <div className={ style.flexLayout }>
          <div className={ style.flexAuto }>
            <Form.Item name="oicqDataDir"
              rules={ [{ required: true, message: '请选择数据存储文件夹', whitespace: true }] }
              noStyle={ true }
            >
              <Input allowClear={ true } />
            </Form.Item>
          </div>
          <div className={ classNames(style.flexFixed, style.marginLeft8) }>
            <Button onClick={ handleSelectOicqDataDirClick }>选择文件夹</Button>
          </div>
        </div>
      </Form.Item>
      <Form.Item label="浏览器(用于验证码)">
        <div className={ style.flexLayout }>
          <div className={ style.flexAuto }>
            <Form.Item name="browser" noStyle={ true }>
              <Input allowClear={ true } />
            </Form.Item>
          </div>
          <div className={ classNames(style.flexFixed, style.marginLeft8) }>
            <Button onClick={ handleBrowserFileClick }>选择文件</Button>
          </div>
        </div>
      </Form.Item>
      <Form.Item name="logLevel" label="默认日志等级">
        <Radio.Group options={ logLevel } />
      </Form.Item>
      <div className={ style.textCenter }>
        <Divider />
        <Link className={ style.marginRight16 } to="/">
          <Button type="primary" danger={ true }>返回</Button>
        </Link>
        <Button type="primary" htmlType="submit">保存</Button>
      </div>
    </Form>
  );
}

export default Index;