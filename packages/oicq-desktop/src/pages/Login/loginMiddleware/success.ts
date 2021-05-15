import type { Store } from 'redux';
import { store } from '../../../store/store';
import { setLoginList, saveAccount } from '../reducers/reducers';
import type { LoginContext } from '../types';

/* 登陆完成 */
async function successMiddleware(ctx: LoginContext, next: Function): Promise<void> {
  const { dispatch }: Store = store;
  const { formValue, loginFormValue, client, clientPlugins, setLoading, onCancel }: LoginContext = ctx;

  // 登陆成功
  dispatch(setLoginList({
    uin: loginFormValue.uin,
    client,
    logLevel: loginFormValue.logLevel,
    plugins: clientPlugins
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