import { render } from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale-provider/zh_CN';
import Routers from './router/Routers';
import dbInit from './utils/idb/dbInit';

/* app */
render(
  <ConfigProvider locale={ zhCN }>
    <HashRouter>
      <Routers />
    </HashRouter>
  </ConfigProvider>,
  document.getElementById('app')
);

dbInit();