import type { OpenDialogReturnValue } from 'electron';
import { dialog } from '@electron/remote';
import type { ReactElement, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Divider, FormInstance } from 'antd';
import classNames from 'classnames';
import style from './index.sass';

/* 系统配置 */
function Index(props: {}): ReactElement {
  const [form]: [FormInstance] = Form.useForm();
  const { setFieldsValue }: FormInstance = form;

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

  return (
    <Form className={ style.content } form={ form }>
      <Form.Item label="数据存储文件夹">
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
      <div className={ style.textCenter }>
        <Divider />
        <Link className={ style.marginRight16 } to="/">
          <Button type="primary" danger={ true }>返回</Button>
        </Link>
        <Button>保存</Button>
      </div>
    </Form>
  );
}

export default Index;