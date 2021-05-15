import type { Client } from 'oicq';
import { useState, ReactElement, Dispatch as D, SetStateAction as S, MouseEvent } from 'react';
import type { Dispatch } from 'redux';
import { useSelector, useDispatch } from 'react-redux';
import { createStructuredSelector, createSelector, Selector } from 'reselect';
import { Link } from 'react-router-dom';
import { Table, Space, Button, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import style from './index.sass';
import LoginModal from './LoginModal';
import { setLogout, LoginInitialState } from './reducers/reducers';
import type { LoginItem } from '../../types';

/* redux selector */
type RSelector = Pick<LoginInitialState, 'loginList'>;

const selector: Selector<any, RSelector> = createStructuredSelector({
  // 已登陆账号的列表
  loginList: createSelector(
    ({ login }: { login: LoginInitialState }): Array<LoginItem> => login.loginList,
    (data: Array<LoginItem>): Array<LoginItem> => data
  )
});

/* 账号登陆 */
function Index(props: {}): ReactElement {
  const { loginList }: RSelector = useSelector(selector);
  const dispatch: Dispatch = useDispatch();
  const [visible, setVisible]: [boolean, D<S<boolean>>] = useState(false);

  // 账号下线
  async function handleLogoutClick(record: LoginItem, event: MouseEvent<HTMLAnchorElement>): Promise<void> {
    for (const plugin of record.plugins) {
      if (typeof plugin.deactivate === 'function') {
        try {
          await plugin.deactivate(record.client);
        } catch (err) {
          console.error(err);
        }
      }

      if (typeof plugin.destructor === 'function') {
        try {
          await plugin.destructor();
        } catch (err) {
          console.error(err);
        }
      }
    }

    await record.client.logout();
    dispatch(setLogout(record));
  }

  const columns: ColumnsType<LoginItem> = [
    { title: '账号', dataIndex: 'uin', width: '50%' },
    {
      title: '状态',
      key: 'status',
      render: (value: undefined, record: LoginItem, index: number): ReactElement => record.client.isOnline()
        ? <Tag color="#52c41a">在线</Tag> : <Tag color="#f5222d">离线</Tag>
    },
    {
      title: '操作',
      key: 'handle',
      width: 80,
      render: (value: undefined, record: LoginItem, index: number): ReactElement => (
        <Button type="primary"
          danger={ true }
          onClick={ (event: MouseEvent<HTMLAnchorElement>): Promise<void> => handleLogoutClick(record, event) }
        >
          下线
        </Button>
      )
    }
  ];

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
      <Table bordered={ true }
        dataSource={ loginList }
        columns={ columns }
        rowKey="uin"
      />
      <LoginModal visible={ visible }
        loginList={ loginList }
        onCancel={ (event: MouseEvent<HTMLButtonElement>): void => setVisible(false) }
      />
    </div>
  );
}

export default Index;