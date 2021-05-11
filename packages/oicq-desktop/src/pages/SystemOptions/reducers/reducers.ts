import type { ActionCreator } from '@reduxjs/toolkit';
import dbRedux, { systemOptionsObjectStoreName } from '../../../utils/idb/dbRedux';

// 保存数据
export const saveSystemOptionsValue: ActionCreator<any> = dbRedux.putAction({
  objectStoreName: systemOptionsObjectStoreName
});

// 获取单个配置
export const getSystemOptionsValue: ActionCreator<any> = dbRedux.getAction({
  objectStoreName: systemOptionsObjectStoreName
});