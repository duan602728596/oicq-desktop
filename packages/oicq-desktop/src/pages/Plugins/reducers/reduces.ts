import { createSlice, Slice, SliceCaseReducers, PayloadAction, CaseReducerActions, ActionCreator } from '@reduxjs/toolkit';
import dbRedux, { pluginsObjectStoreName } from '../../../utils/idb/dbRedux';
import type { PluginItem } from '../../../types';

export interface PluginsInitialState {
  pluginsList: Array<PluginItem>;
}

type CaseReducers = SliceCaseReducers<PluginsInitialState>;

const { actions, reducer }: Slice = createSlice<PluginsInitialState, CaseReducers>({
  name: 'plugins',
  initialState: {
    pluginsList: [] // 插件列表
  },
  reducers: {
    // 获取插件列表
    setPluginsList(state: PluginsInitialState, action: PayloadAction<{ result: Array<PluginItem> }>): void {
      state.pluginsList = action.payload.result;
    }
  }
});

export const { setPluginsList }: CaseReducerActions<CaseReducers> = actions;

export const queryPluginsList: ActionCreator<any> = dbRedux.cursorAction({
  objectStoreName: pluginsObjectStoreName,
  successAction: setPluginsList
});

export default { plugins: reducer };