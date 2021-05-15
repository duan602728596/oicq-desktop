import { Fragment, useState, useEffect, ReactElement, Dispatch as D, SetStateAction as S, MouseEvent } from 'react';
import type { Dispatch } from 'redux';
import { useSelector, useDispatch } from 'react-redux';
import { createStructuredSelector, createSelector, Selector } from 'reselect';
import { Link } from 'react-router-dom';
import { Table, Button, Space, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import style from './index.sass';
import PluginModal from './PluginModal';
import { queryPluginsList, deleteAPlugin, PluginsInitialState } from './reducers/reduces';
import dbConfig from '../../utils/idb/dbConfig';
import type { PluginItem } from '../../types';

/* redux selector */
const selector: Selector<any, PluginsInitialState> = createStructuredSelector({
  // 插件列表
  pluginsList: createSelector(
    ({ plugins }: { plugins: PluginsInitialState }): Array<PluginItem> => plugins.pluginsList,
    (data: Array<PluginItem>): Array<PluginItem> => data
  )
});

/* 插件加载 */
function Index(props: {}): ReactElement {
  const { pluginsList }: PluginsInitialState = useSelector(selector);
  const dispatch: Dispatch = useDispatch();
  const [visible, setVisible]: [boolean, D<S<boolean>>] = useState(false); // 弹出层的展示隐藏
  const [item, setItem]: [PluginItem | undefined, D<S<PluginItem | undefined>>] = useState(undefined);

  // 关闭
  function handleClosePluginModalClick(event: MouseEvent<HTMLButtonElement>): void {
    setVisible(false);
    setItem(undefined);
  }

  // 点击加载插件
  function handlePluginModalOpenClick(record: PluginItem | undefined, event: MouseEvent<HTMLButtonElement>): void {
    setItem(record);
    setVisible(true);
  }

  // 删除插件
  function handleDeleteAPluginClick(record: PluginItem, event: MouseEvent<HTMLButtonElement>): void {
    dispatch(deleteAPlugin({
      query: record.id
    }));
  }

  function titleRender(): ReactElement {
    return (
      <Space>
        <Link to="/">
          <Button type="primary" danger={ true }>返回</Button>
        </Link>
        <Button onClick={ (event: MouseEvent<HTMLButtonElement>): void => handlePluginModalOpenClick(undefined, event) }>
          加载插件
        </Button>
      </Space>
    );
  }

  const columns: ColumnsType<PluginItem> = [
    { title: '插件名称', dataIndex: 'name' },
    {
      title: '方式加载',
      dataIndex: 'esm',
      render: (value: boolean, record: PluginItem, index: number): string => value ? 'esm' : 'commonjs'
    },
    {
      title: '是否启用',
      dataIndex: 'use',
      render: (value: boolean, record: PluginItem, index: number): ReactElement => value
        ? <Tag color="#52c41a">启用</Tag> : <Tag color="#f5222d">停用</Tag>
    },
    {
      title: '操作',
      key: 'handle',
      width: 130,
      render: (value: undefined, record: PluginItem, index: number): ReactElement => (
        <Button.Group>
          <Button onClick={ (event: MouseEvent<HTMLButtonElement>): void => handlePluginModalOpenClick(record, event) }>
            编辑
          </Button>
          <Button type="primary"
            danger={ true }
            onClick={ (event: MouseEvent<HTMLButtonElement>): void => handleDeleteAPluginClick(record, event) }
          >
            删除
          </Button>
        </Button.Group>
      )
    }
  ];

  useEffect(function(): void {
    dispatch(queryPluginsList({
      query: {
        indexName: dbConfig.objectStore[1].data[0]
      }
    }));
  }, []);

  return (
    <Fragment>
      <Table className={ style.table }
        bordered={ true }
        title={ titleRender }
        dataSource={ pluginsList }
        columns={ columns }
        rowKey="id"
      />
      <PluginModal visible={ visible } item={ item } onCancel={ handleClosePluginModalClick } />
    </Fragment>
  );
}

export default Index;