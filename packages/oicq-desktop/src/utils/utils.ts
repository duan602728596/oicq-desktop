/* 加载esm模块 */
// eslint-disable-next-line no-new-func
export const importESM: <T = any>(id: string) => Promise<T> = new Function('id', 'return import(id)') as any;

/* 随机字符串 */
export function randomStr(len: number): string {
  const str: string = 'QWERTYUIOPASDFGHJKLZXCVBNM1234567890';
  let result: string = '';

  for (let i: number = 0; i < len; i++) {
    const rIndex: number = Math.floor(Math.random() * str.length);

    result += str[rIndex];
  }

  return result;
}