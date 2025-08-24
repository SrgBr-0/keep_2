import type { EntityMetadata } from './src/remult3/remult3.js';
import type { SqlCommand, SqlImplementation } from './src/sql-command.js';
import type { FieldMetadata } from './src/column-interfaces.js';
import type { CanBuildMigrations, MigrationBuilder, MigrationCode } from './migrations/migration-types.js';
export declare class SqliteCoreDataProvider implements SqlImplementation, CanBuildMigrations {
    createCommand: () => SqlCommand;
    end: () => Promise<void>;
    doesNotSupportReturningSyntax: boolean;
    doesNotSupportReturningSyntaxOnlyForUpdate: boolean;
    constructor(createCommand: () => SqlCommand, end: () => Promise<void>, doesNotSupportReturningSyntax?: boolean, doesNotSupportReturningSyntaxOnlyForUpdate?: boolean);
    orderByNullsFirst?: boolean;
    getLimitSqlSyntax(limit: number, offset: number): string;
    afterMutation?: VoidFunction;
    provideMigrationBuilder(builder: MigrationCode): MigrationBuilder;
    transaction(action: (sql: SqlImplementation) => Promise<void>): Promise<void>;
    entityIsUsedForTheFirstTime(entity: EntityMetadata): Promise<void>;
    ensureSchema(entities: EntityMetadata<any>[]): Promise<void>;
    verifyAllColumns<T extends EntityMetadata>(entity: T): Promise<void>;
    dropTable(entity: EntityMetadata): Promise<void>;
    addColumnSqlSyntax(x: FieldMetadata, dbName: string, isAlterTable: boolean): string;
    createTableIfNotExist(entity: EntityMetadata<any>): Promise<void>;
    supportsJsonColumnType?: boolean;
    getCreateTableSql(entity: EntityMetadata<any>): Promise<string[]>;
    wrapIdentifier(name: string): string;
}
