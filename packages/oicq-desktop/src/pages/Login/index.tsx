import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { Table, Space, Button } from 'antd';
import style from './index.sass';

/* 账号登陆 */
function Index(props: {}): ReactElement {
  return (
    <div className={ style.content }>
      <header className={ style.header }>
        <Space>
          <Link to="/">
            <Button type="primary" danger={ true }>返回</Button>
          </Link>
          <Button type="primary">账号登陆</Button>
        </Space>
      </header>
      <Table />
    </div>
  );
}

export default Index;