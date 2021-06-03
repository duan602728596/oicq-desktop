/* 加载esm模块 */
// eslint-disable-next-line no-new-func
export const importESM: <T = any>(id: string) => Promise<T> = new Function('id', 'return import(id)') as any;