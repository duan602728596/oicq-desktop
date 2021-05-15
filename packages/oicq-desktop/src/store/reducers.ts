import { ReducersMapObject } from '@reduxjs/toolkit';
import loginReducers from '../pages/Login/reducers/reducers';
import pluginsReducers from '../pages/Plugins/reducers/reduces';

/* reducers */
export const reducersMapObject: ReducersMapObject = Object.assign({},
  loginReducers,
  pluginsReducers
);

export const ignoreOptions: any = {
  ignoredPaths: ['login.loginList'],
  ignoredActions: ['login/setLoginList', 'login/setLogout']
};