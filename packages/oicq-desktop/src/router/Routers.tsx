import type { ReactElement } from 'react';
import { useRoutes } from 'react-router-dom';
import Index from '../pages/Index/index';
import SystemOptions from '../pages/SystemOptions/index';

function Routers(props: {}): ReactElement | null {
  const routes: ReactElement | null = useRoutes([
    { path: '//*', element: <Index /> },
    { path: '/SystemOptions', element: <SystemOptions /> }
  ]);

  return routes;
}

export default Routers;