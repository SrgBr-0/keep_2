import type { Knex } from 'knex';
import { type EntityDbNamesBase } from '../src/filter/filter-consumer-bridge-to-sql-request.js';
import type { FieldMetadata } from '../src/column-interfaces.js';
import type { DataProvider, EntityDataProvider } from '../src/data-interfaces.js';
import type { EntityFilter, EntityMetadata } from '../src/remult3/remult3.js';
import type { RepositoryOverloads } from '../src/remult3/RepositoryImplementation.js';
import type { HasWrapIdentifier, SqlCommand, SqlCommandFactory, SqlResult } from '../src/sql-command.js';
import type { CanBuildMigrations, MigrationBuilder, MigrationCode } from '../migrations/migration-types.js';
export declare class KnexDataProvider implements DataProvider, HasWrapIdentifier, SqlCommandFactory, CanBuildMigrations {
    knex: Knex;
    constructor(knex: Knex);
    end(): Promise<void>;
    provideMigrationBuilder(builder: MigrationCode): MigrationBuilder;
    createCommand(): SqlCommand;
    execute(sql: string): Promise<SqlResult>;
    static getDb(dataProvider?: DataProvider): Knex<any, any[]>;
    wrapIdentifier: (name: string) => string;
    getEntityDataProvider(entity: EntityMetadata<any>): EntityDataProvider;
    transaction(action: (dataProvider: DataProvider) => Promise<void>): Promise<void>;
    static rawFilter(build: CustomKnexFilterBuilderFunction): EntityFilter<any>;
    static filterToRaw<entityType>(entity: RepositoryOverloads<entityType>, condition: EntityFilter<entityType>, wrapIdentifier?: (name: string) => string): Promise<(knex: Knex.QueryBuilder) => void>;
    isProxy?: boolean;
    ensureSchema(entities: EntityMetadata<any>[]): Promise<void>;
}
export type CustomKnexFilterBuilderFunction = () => Promise<(builder: Knex.QueryBuilder) => void>;
export declare class KnexSchemaBuilder {
    private knex;
    ensureSchema(entities: EntityMetadata<any>[]): Promise<void>;
    createIfNotExist(entity: EntityMetadata): Promise<void>;
    createTableKnexCommand(entity: EntityMetadata, e: EntityDbNamesBase): Knex.SchemaBuilder;
    addColumnIfNotExist(entity: EntityMetadata, c: (e: EntityMetadata) => FieldMetadata): Promise<void>;
    createColumnKnexCommand(e: EntityDbNamesBase, col: FieldMetadata<any, any>, colName: string): Knex.SchemaBuilder;
    verifyAllColumns<T extends EntityMetadata>(entity: T): Promise<void>;
    additionalWhere: string;
    constructor(knex: Knex);
}
export declare function buildColumn(x: FieldMetadata, dbName: string, b: Knex.CreateTableBuilder, supportsJson?: boolean): void;
export declare function createKnexDataProvider(config: Knex.Config): Promise<KnexDataProvider>;
