
const DB_NAME = 'ai-orchestrator-db';
const DB_VERSION = 3; // Incremented version to trigger onupgradeneeded
export const STORE_NAMES = {
  DASHBOARD: 'dashboard',
  API_INSPECTOR: 'api_inspector',
  SECURE_TERMINAL: 'secure_terminal',
  PAGE_DEPLOYER: 'page_deployer',
};

let db: IDBDatabase;

const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(db);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('IndexedDB error:', request.error);
      reject('Error opening IndexedDB');
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      if (!dbInstance.objectStoreNames.contains(STORE_NAMES.DASHBOARD)) {
        dbInstance.createObjectStore(STORE_NAMES.DASHBOARD);
      }
      if (!dbInstance.objectStoreNames.contains(STORE_NAMES.API_INSPECTOR)) {
        dbInstance.createObjectStore(STORE_NAMES.API_INSPECTOR);
      }
      if (!dbInstance.objectStoreNames.contains(STORE_NAMES.SECURE_TERMINAL)) {
        dbInstance.createObjectStore(STORE_NAMES.SECURE_TERMINAL);
      }
      if (!dbInstance.objectStoreNames.contains(STORE_NAMES.PAGE_DEPLOYER)) {
        dbInstance.createObjectStore(STORE_NAMES.PAGE_DEPLOYER);
      }
    };
  });
};

const getStore = (storeName: string, mode: IDBTransactionMode) => {
  const tx = db.transaction(storeName, mode);
  return tx.objectStore(storeName);
};

export const dbService = {
  async get<T>(storeName: string, key: IDBValidKey): Promise<T | undefined> {
    await initDB();
    return new Promise((resolve, reject) => {
      const store = getStore(storeName, 'readonly');
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result as T);
      request.onerror = () => reject(request.error);
    });
  },

  async set(storeName: string, key: IDBValidKey, value: any): Promise<void> {
    await initDB();
    return new Promise((resolve, reject) => {
      const store = getStore(storeName, 'readwrite');
      const request = store.put(value, key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },
};
