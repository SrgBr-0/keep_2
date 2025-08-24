import type { ClientBase, PoolConfig, QueryResult } from 'pg';
import { SqlDatabase } from '../src/data-providers/sql-database.js';
import type { EntityMetadata } from '../src/remult3/remult3.js';
import type { SqlCommand, SqlImplementation } from '../src/sql-command.js';
import type { CanBuildMigrations, MigrationBuilder, MigrationCode } from '../migrations/migration-types.js';
import type { DataProvider } from '../index.js';
export interface PostgresPool extends PostgresCommandSource {
    connect(): Promise<PostgresClient>;
    end(): Promise<void>;
}
export interface PostgresClient extends PostgresCommandSource {
    release(): void;
}
export declare class PostgresDataProvider implements SqlImplementation, CanBuildMigrations {
    private pool;
    private options?;
    supportsJsonColumnType: boolean;
    static getDb(dataProvider?: DataProvider): ClientBase;
    entityIsUsedForTheFirstTime(entity: EntityMetadata): Promise<void>;
    getLimitSqlSyntax(limit: number, offset: number): string;
    createCommand(): SqlCommand;
    constructor(pool: PostgresPool, options?: {
        wrapIdentifier?: (name: string) => string;
        caseInsensitiveIdentifiers?: boolean;
        schema?: string;
        orderByNullsFirst?: boolean;
    } | undefined);
    end(): Promise<void>;
    provideMigrationBuilder(builder: MigrationCode): MigrationBuilder;
    wrapIdentifier: (name: string) => string;
    ensureSchema(entities: EntityMetadata<any>[]): Promise<void>;
    orderByNullsFirst?: boolean;
    transaction(action: (dataProvider: SqlImplementation) => Promise<void>): Promise<void>;
}
export interface PostgresCommandSource {
    query(queryText: string, values?: any[]): Promise<QueryResult>;
}
export declare function createPostgresConnection(options?: Parameters<typeof createPostgresDataProvider>[0]): Promise<SqlDatabase>;
export declare function createPostgresDataProvider(options?: {
    connectionString?: string;
    sslInDev?: boolean;
    configuration?: 'heroku' | PoolConfig;
    wrapIdentifier?: (name: string) => string;
    caseInsensitiveIdentifiers?: boolean;
    schema?: string;
    orderByNullsFirst?: boolean;
}): Promise<SqlDatabase>;
export declare function preparePostgresQueueStorage(sql: SqlDatabase): Promise<import("../server/remult-api-server.js").EntityQueueStorage>;
export declare class PostgresSchemaWrapper implements PostgresPool {
    private pool;
    private schema;
    constructor(pool: PostgresPool, schema: string);
    connect(): Promise<PostgresClient>;
    query(queryText: string, values?: any[]): Promise<QueryResult>;
    end(): Promise<void>;
}
