import { Fragment, useState, ReactElement, Dispatch as D, SetStateAction as S } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Space } from 'antd';
import style from './index.sass';
import PluginModal from './PluginModal';
import type { PluginItem } from '../../types';

/* 插件加载 */
function Index(props: {}): ReactElement {
  const [visible, setVisible]: [boolean, D<S<boolean>>] = useState(false); // 弹出层的展示隐藏
  const [item, setItem]: [PluginItem | undefined, D<S<PluginItem | undefined>>] = useState(undefined);

  function titleRender(): ReactElement {
    return (
      <Space>
        <Link to="/">
          <Button type="primary" danger={ true }>返回</Button>
        </Link>
        <Button>加载插件</Button>
      </Space>
    );
  }

  return (
    <Fragment>
      <Table className={ style.table } title={ titleRender } />
      <PluginModal visible={ visible } item={ item } />
    </Fragment>
  );
}

export default Index;