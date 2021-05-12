import { ReducersMapObject } from '@reduxjs/toolkit';
import pluginsReducers from '../pages/Plugins/reducers/reduces';

/* reducers */
export const reducersMapObject: ReducersMapObject = Object.assign({},
  pluginsReducers
);

export const ignoreOptions: any = {
  ignoredPaths: [],
  ignoredActions: []
};