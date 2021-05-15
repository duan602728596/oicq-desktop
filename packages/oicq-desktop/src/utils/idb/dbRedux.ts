import IndexedDBRedux from 'indexeddb-tools-redux';
import dbConfig, { ObjectStoreItem } from './dbConfig';

/* indexeddb redux */
const db: IndexedDBRedux = new IndexedDBRedux(dbConfig.name, dbConfig.version);
const objectStore: Array<ObjectStoreItem> = dbConfig.objectStore;

export const systemOptionsObjectStoreName: string = objectStore[0].name;
export const pluginsObjectStoreName: string = objectStore[1].name;
export const accountObjectStoreName: string = objectStore[2].name;

export default db;