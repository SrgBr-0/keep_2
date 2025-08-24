import type { Database } from 'better-sqlite3';
import { SqliteCoreDataProvider } from './remult-sqlite-core.js';
import type { SqlResult } from './src/sql-command.js';
export declare class BetterSqlite3DataProvider extends SqliteCoreDataProvider {
    constructor(db: Database);
}
export declare class BetterSqlite3SqlResult implements SqlResult {
    private result;
    constructor(result: any[]);
    rows: any[];
    getColumnKeyInResultForIndexInSelect(index: number): string;
}
