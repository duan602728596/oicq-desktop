import { Fragment, ReactElement } from 'react';
import { Button, Space } from 'antd';
import style from './index.sass';

function Index(props: {}): ReactElement {
  return (
    <Fragment>
      <div className={ style.content }>
        <Space className={ style.space } direction="vertical">
          <Button type="primary" block={ true }>账号登陆</Button>
          <Button block={ true }>插件加载</Button>
          <Button block={ true }>系统配置</Button>
        </Space>
      </div>
    </Fragment>
  );
}

export default Index;