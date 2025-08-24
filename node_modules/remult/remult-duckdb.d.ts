import type { Database } from 'duckdb';
import { SqliteCoreDataProvider } from './remult-sqlite-core.js';
import { type FieldMetadata, type EntityMetadata } from './index.js';
export declare class DuckDBDataProvider extends SqliteCoreDataProvider {
    constructor(db: Database);
    wrapIdentifier(name: string): string;
    getCreateTableSql(entity: EntityMetadata<any>): Promise<string[]>;
    addColumnSqlSyntax(x: FieldMetadata, dbName: string, isAlterColumn: boolean): string;
}
