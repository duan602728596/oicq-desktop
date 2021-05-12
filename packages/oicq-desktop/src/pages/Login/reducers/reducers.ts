import { createSlice, Slice, SliceCaseReducers, PayloadAction, CaseReducerActions, ActionCreator } from '@reduxjs/toolkit';
import type { LoginItem } from '../../../types';

export interface LoginInitialState {
  loginList: Array<LoginItem>;
}

type CaseReducers = SliceCaseReducers<LoginInitialState>;

const { actions, reducer }: Slice = createSlice<LoginInitialState, CaseReducers>({
  name: 'login',
  initialState: {
    loginList: [] // 已登陆账号的列表
  },
  reducers: {}
});

export default { login: reducer };