import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale-provider/zh_CN';
import { storeFactory } from './store/store';
import Routers from './router/Routers';
import dbInit from './utils/idb/dbInit';

/* app */
render(
  <Provider store={ storeFactory() }>
    <ConfigProvider locale={ zhCN }>
      <HashRouter>
        <Routers />
      </HashRouter>
    </ConfigProvider>
  </Provider>,
  document.getElementById('app')
);

dbInit();