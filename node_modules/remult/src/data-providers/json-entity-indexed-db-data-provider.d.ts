import type { JsonEntityStorage } from './json-data-provider.js';
export declare class JsonEntityIndexedDbStorage implements JsonEntityStorage {
    private dbName;
    private storeName;
    constructor(dbName?: string, storeName?: string);
    supportsRawJson: boolean;
    getItem(entityDbName: string): Promise<string>;
    setItem(entityDbName: string, json: string): Promise<void>;
}
