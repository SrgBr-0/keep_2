import { SqlDatabase } from './index.js';
import { SqliteCoreDataProvider } from './remult-sqlite-core.js';
import type { Database } from 'sqlite3';
export declare function createSqlite3DataProvider(fileName?: string): Promise<SqlDatabase>;
export declare class Sqlite3DataProvider extends SqliteCoreDataProvider {
    constructor(db: Database);
}
