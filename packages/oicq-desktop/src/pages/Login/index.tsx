import { useState, ReactElement, Dispatch as D, SetStateAction as S, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { Table, Space, Button } from 'antd';
import style from './index.sass';
import LoginModal from './LoginModal';

/* 账号登陆 */
function Index(props: {}): ReactElement {
  const [visible, setVisible]: [boolean, D<S<boolean>>] = useState(false);

  return (
    <div className={ style.content }>
      <header className={ style.header }>
        <Space>
          <Link to="/">
            <Button type="primary" danger={ true }>返回</Button>
          </Link>
          <Button type="primary" onClick={ (event: MouseEvent<HTMLButtonElement>): void => setVisible(true) }>
            账号登陆
          </Button>
        </Space>
      </header>
      <Table />
      <LoginModal visible={ visible } onCancel={ (event: MouseEvent<HTMLButtonElement>): void => setVisible(false) } />
    </div>
  );
}

export default Index;