import { createSlice, Slice, SliceCaseReducers, PayloadAction, CaseReducerActions, ActionCreator } from '@reduxjs/toolkit';
import type { Draft } from 'immer';
import dbRedux, { systemOptionsObjectStoreName } from '../../../utils/idb/dbRedux';
import type { LoginItem, SystemOptions } from '../../../types';
import type { QuerySystemOptionsResult } from '../types';

export interface LoginInitialState {
  loginList: Array<LoginItem>;
  systemOptions: SystemOptions | undefined;
}

type CaseReducers = SliceCaseReducers<LoginInitialState>;

const { actions, reducer }: Slice = createSlice<LoginInitialState, CaseReducers>({
  name: 'login',
  initialState: {
    loginList: [],           // 已登陆账号的列表
    systemOptions: undefined // 系统配置
  },
  reducers: {
    // 获取系统配置
    setSystemOptions(state: Draft<LoginInitialState>, action: PayloadAction<QuerySystemOptionsResult>): void {
      state.systemOptions = action.payload.result?.value;
    }
  }
});

export const { setSystemOptions }: CaseReducerActions<CaseReducers> = actions;

// 获取单个配置
export const getSystemOptionsValue: ActionCreator<any> = dbRedux.getAction({
  objectStoreName: systemOptionsObjectStoreName,
  successAction: setSystemOptions
});

export default { login: reducer };