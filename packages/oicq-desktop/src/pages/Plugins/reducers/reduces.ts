import { createSlice, Slice, SliceCaseReducers, PayloadAction, CaseReducerActions, ActionCreator } from '@reduxjs/toolkit';
import { findIndex } from 'lodash-es';
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
    },

    // 插件保存后添加到列表中
    setSaveAPlugin(state: PluginsInitialState, action: PayloadAction<{ data: PluginItem }>): void {
      const index: number = findIndex(state.pluginsList, { id: action.payload.data.id });

      if (index < 0) {
        state.pluginsList = [...state.pluginsList, action.payload.data];
      } else {
        state.pluginsList[index] = action.payload.data;
        state.pluginsList = [...state.pluginsList];
      }
    },

    // 删除插件
    setDeleteAPlugin(state: PluginsInitialState, action: PayloadAction<{ query: string }>): void {
      const index: number = findIndex(state.pluginsList, { id: action.payload.query });

      if (index >= 0) {
        state.pluginsList.splice(index, 1);
        state.pluginsList = [...state.pluginsList];
      }
    }
  }
});

export const { setPluginsList, setSaveAPlugin, setDeleteAPlugin }: CaseReducerActions<CaseReducers> = actions;

// 查询插件列表
export const queryPluginsList: ActionCreator<any> = dbRedux.cursorAction({
  objectStoreName: pluginsObjectStoreName,
  successAction: setPluginsList
});

// 保存插件
export const saveAPlugin: ActionCreator<any> = dbRedux.putAction({
  objectStoreName: pluginsObjectStoreName,
  successAction: setSaveAPlugin
});

// 删除插件
export const deleteAPlugin: ActionCreator<any> = dbRedux.deleteAction({
  objectStoreName: pluginsObjectStoreName,
  successAction: setDeleteAPlugin
});

export default { plugins: reducer };