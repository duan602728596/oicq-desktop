/* 数据库配置 */
export interface ObjectStoreItem {
  name: string;
  key: string;
  data: Array<string>;
}

export interface DbConfig {
  name: string;
  version: number;
  objectStore: Array<ObjectStoreItem>;
}

const dbConfig: DbConfig = {
  name: 'oicq-desktop',
  version: 1,
  objectStore: [
    // 系统配置
    {
      name: 'system_options',
      key: 'name',
      data: ['value']
    },

    // 插件
    {
      name: 'plugins',
      key: 'id',
      data: ['path', 'name', 'esm']
    },

    // 本地记住的账号
    {
      name: 'account',
      key: 'uin',
      data: ['password']
    }
  ]
};

export default dbConfig;