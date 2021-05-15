import { createSlice, Slice, SliceCaseReducers, PayloadAction, CaseReducerActions, ActionCreator } from '@reduxjs/toolkit';
import { findIndex } from 'lodash-es';
import dbRedux, { systemOptionsObjectStoreName, accountObjectStoreName } from '../../../utils/idb/dbRedux';
import type { SystemOptions } from '../../../types';
import type { QuerySystemOptionsResult, AccountItem, LoginItem } from '../types';

export interface LoginInitialState {
  loginList: Array<LoginItem>;
  systemOptions: SystemOptions | undefined;
  accountList: Array<AccountItem>;
}

type CaseReducers = SliceCaseReducers<LoginInitialState>;

const { actions, reducer }: Slice = createSlice<LoginInitialState, CaseReducers>({
  name: 'login',
  initialState: {
    loginList: [],            // 已登陆账号的列表
    systemOptions: undefined, // 系统配置
    accountList: []           // 已保存的账号信息
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
    },

    // 已登陆账号的列表
    setAccountList(state: LoginInitialState, action: PayloadAction<{ result: Array<AccountItem> }>): void {
      state.accountList = action.payload.result;
    },

    // 删除一个常用账号
    setDeleteAccount(state: LoginInitialState, action: PayloadAction<{ query: string }>): void {
      const index: number = findIndex(state.accountList, { uin: action.payload.query });

      if (index >= 0) {
        state.accountList.splice(index, 1);
        state.accountList = [...state.accountList];
      }
    }
  }
});

export const {
  setSystemOptions,
  setLoginList,
  setLogout,
  setAccountList,
  setDeleteAccount
}: CaseReducerActions<CaseReducers> = actions;

// 获取单个配置
export const getSystemOptionsValue: ActionCreator<any> = dbRedux.getAction({
  objectStoreName: systemOptionsObjectStoreName,
  successAction: setSystemOptions
});

// 记住账号
export const saveAccount: ActionCreator<any> = dbRedux.putAction({
  objectStoreName: accountObjectStoreName
});

// 获取账号列表
export const getAccountList: ActionCreator<any> = dbRedux.cursorAction({
  objectStoreName: accountObjectStoreName,
  successAction: setAccountList
});

// 删除一个账号
export const deleteAccount: ActionCreator<any> = dbRedux.deleteAction({
  objectStoreName: accountObjectStoreName,
  successAction: setDeleteAccount
});

export default { login: reducer };