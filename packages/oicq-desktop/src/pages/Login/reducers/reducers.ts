import { createSlice, Slice, SliceCaseReducers, PayloadAction, CaseReducerActions, ActionCreator } from '@reduxjs/toolkit';
import { findIndex } from 'lodash-es';
import dbRedux, { systemOptionsObjectStoreName, accountObjectStoreName } from '../../../utils/idb/dbRedux';
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
    setSystemOptions(state: LoginInitialState, action: PayloadAction<QuerySystemOptionsResult>): void {
      state.systemOptions = action.payload.result?.value;
    },

    // 已登陆账号的列表
    setLoginList(state: LoginInitialState, action: PayloadAction<LoginItem>): void {
      state.loginList = [...state.loginList, action.payload];
    },

    // 账号下线
    setLogout(state: LoginInitialState, action: PayloadAction<LoginItem>): void {
      const index: number = findIndex(state.loginList, { uin: action.payload.uin });

      if (index >= 0) {
        state.loginList.splice(index, 1);
        state.loginList = [...state.loginList];
      }
    }
  }
});

export const { setSystemOptions, setLoginList, setLogout }: CaseReducerActions<CaseReducers> = actions;

// 获取单个配置
export const getSystemOptionsValue: ActionCreator<any> = dbRedux.getAction({
  objectStoreName: systemOptionsObjectStoreName,
  successAction: setSystemOptions
});

// 记住账号
export const saveAccount: ActionCreator<any> = dbRedux.putAction({
  objectStoreName: accountObjectStoreName
});

export default { login: reducer };