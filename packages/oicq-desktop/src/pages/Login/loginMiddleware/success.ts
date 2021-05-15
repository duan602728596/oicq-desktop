import type { Store } from 'redux';
import { store } from '../../../store/store';
import { setLoginList, saveAccount } from '../reducers/reducers';
import type { LoginContext } from '../types';

/* 登陆完成 */
async function successMiddleware(ctx: LoginContext, next: Function): Promise<void> {
  const { dispatch }: Store = store;
  const { formValue, loginFormValue, client, usePluginsList, setLoading, onCancel }: LoginContext = ctx;

  dispatch(setLoginList({
    uin: loginFormValue.uin,
    client,
    logLevel: loginFormValue.logLevel,
    plugins: usePluginsList
  }));

  // 记住账号
  if (formValue.remember) {
    await dispatch(saveAccount({
      data: {
        uin: formValue.uin,
        password: formValue.password
      }
    }));
  }

  setLoading(false);
  // @ts-ignore
  onCancel();
}

export default successMiddleware;