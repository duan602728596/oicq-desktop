import { ipcRenderer } from 'electron';
import type { ReactElement, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button, Space } from 'antd';
import { ToolTwoTone as IconToolTwoTone } from '@ant-design/icons';
import style from './index.sass';

/* 首屏菜单 */
function Index(props: {}): ReactElement {
  // 打开开发者工具
  function handleOpenDeveloperToolsClick(event: MouseEvent): void {
    ipcRenderer.send('developer-tools');
  }

  return (
    <nav className={ style.content }>
      <Space className={ style.space } size={ 24 } direction="vertical">
        <Button type="primary" block={ true }>账号登陆</Button>
        <Button block={ true }>插件加载</Button>
        <Link to="SystemOptions">
          <Button block={ true }>系统配置</Button>
        </Link>
        <Button icon={ <IconToolTwoTone /> } block={ true } onClick={ handleOpenDeveloperToolsClick }>开发者工具</Button>
      </Space>
    </nav>
  );
}

export default Index;