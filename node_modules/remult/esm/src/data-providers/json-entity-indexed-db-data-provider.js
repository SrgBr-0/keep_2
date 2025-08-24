export class JsonEntityIndexedDbStorage {
    dbName;
    storeName;
    constructor(dbName = 'db', storeName = 'jsonStore') {
        this.dbName = dbName;
        this.storeName = storeName;
    }
    supportsRawJson = true;
    //@internal
    db;
    async getItem(entityDbName) {
        return new Promise(async (resolve, reject) => {
            const transaction = (await this.init()).transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(entityDbName);
            request.onerror = (event) => reject(request.error);
            request.onsuccess = (event) => {
                if (request.result) {
                    resolve(request.result);
                }
                else {
                    resolve(null);
                }
            };
        });
    }
    //@internal
    async init() {
        if (!this.db) {
            this.db = await new Promise((resolve, reject) => {
                let db;
                const request = indexedDB.open(this.dbName, 1);
                request.onerror = (event) => reject(request.error);
                request.onsuccess = (event) => {
                    db = request.result;
                    resolve(db);
                };
                request.onupgradeneeded = (event) => {
                    db = request.result;
                    db.createObjectStore(this.storeName);
                };
            });
        }
        return this.db;
    }
    async setItem(entityDbName, json) {
        return new Promise(async (resolve, reject) => {
            const transaction = (await this.init()).transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(json, entityDbName);
            request.onerror = (event) => reject(request.error);
            request.onsuccess = (event) => resolve();
        });
    }
}
