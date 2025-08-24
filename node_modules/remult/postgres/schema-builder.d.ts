import type { FieldMetadata } from '../src/column-interfaces.js';
import type { SqlDatabase } from '../src/data-providers/sql-database.js';
import type { EntityMetadata } from '../src/remult3/remult3.js';
export declare function postgresColumnSyntax(x: FieldMetadata, dbName: string): string;
export declare class PostgresSchemaBuilder {
    private pool;
    private removeQuotes;
    private whereTableAndSchema;
    private schemaAndName;
    private schemaOnly;
    ensureSchema(entities: EntityMetadata[]): Promise<void>;
    createIfNotExist(entity: EntityMetadata): Promise<void>;
    verifyAllColumns<T extends EntityMetadata>(entity: T): Promise<void>;
    specifiedSchema: string;
    constructor(pool: SqlDatabase, schema?: string);
}
