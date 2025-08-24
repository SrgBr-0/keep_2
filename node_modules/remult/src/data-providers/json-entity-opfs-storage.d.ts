import type { JsonEntityStorage } from './json-data-provider.js';
export declare class JsonEntityOpfsStorage implements JsonEntityStorage {
    getItem(entityDbName: string): Promise<string>;
    setItem(entityDbName: string, json: string): Promise<void>;
}
