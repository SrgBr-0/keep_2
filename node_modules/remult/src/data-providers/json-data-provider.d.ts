import type { DataProvider, EntityDataProvider } from '../data-interfaces.js';
import type { EntityMetadata } from '../remult3/remult3.js';
export interface JsonEntityStorage {
    getItem(entityDbName: string): any | null | Promise<any | null>;
    setItem(entityDbName: string, json: any): void | Promise<void>;
    supportsRawJson?: boolean;
}
export declare class JsonDataProvider implements DataProvider {
    private storage;
    private formatted;
    constructor(storage: JsonEntityStorage, formatted?: boolean);
    getEntityDataProvider(entity: EntityMetadata): EntityDataProvider;
    transaction(action: (dataProvider: DataProvider) => Promise<void>): Promise<void>;
}
