import type { Database } from 'sql.js';
import { SqliteCoreDataProvider } from './remult-sqlite-core.js';
export declare class SqlJsDataProvider extends SqliteCoreDataProvider {
    constructor(db: Promise<Database>);
}
