import type { DataProvider, EntityDataProvider, EntityDataProviderGroupByOptions } from '../data-interfaces.js';
import type { HasWrapIdentifier, SqlCommand, SqlCommandFactory, SqlCommandWithParameters, SqlImplementation, SqlResult } from '../sql-command.js';
import type { CustomSqlFilterBuilderFunction, EntityDbNamesBase } from '../filter/filter-consumer-bridge-to-sql-request.js';
import { type EntityFilter, type EntityMetadata } from '../remult3/remult3.js';
import type { RepositoryOverloads } from '../remult3/RepositoryImplementation.js';
import type { CanBuildMigrations, MigrationBuilder, MigrationCode } from '../../migrations/migration-types.js';
/**
 * A DataProvider for Sql Databases
 * @example
 * const db = new SqlDatabase(new PostgresDataProvider(pgPool))
* @see [Connecting a Database](https://remult.dev/docs/quickstart#connecting-a-database)

 */
export declare class SqlDatabase implements DataProvider, HasWrapIdentifier, CanBuildMigrations, SqlCommandFactory {
    private sql;
    /**
     * Gets the SQL database from the data provider.
     * @param dataProvider - The data provider.
     * @returns The SQL database.
     * @see [Direct Database Access](https://remult.dev/docs/running-sql-on-the-server)
     */
    static getDb(dataProvider?: DataProvider): SqlDatabase;
    /**
     * Creates a new SQL command.
     * @returns The SQL command.
     * @see [Direct Database Access](https://remult.dev/docs/running-sql-on-the-server)
     */
    createCommand(): SqlCommand;
    /**
     * Executes a SQL command.
     * @param sql - The SQL command.
     * @returns The SQL result.
     * @see [Direct Database Access](https://remult.dev/docs/running-sql-on-the-server)
     */
    execute(sql: string): Promise<SqlResult>;
    /**
     * Wraps an identifier with the database's identifier syntax.
     */
    wrapIdentifier: (name: string) => string;
    ensureSchema(entities: EntityMetadata[]): Promise<void>;
    /**
     * Gets the entity data provider.
     * @param entity  - The entity metadata.
     * @returns The entity data provider.
     */
    getEntityDataProvider(entity: EntityMetadata): EntityDataProvider;
    /**
     * Runs a transaction. Used internally by remult when transactions are required
     * @param action - The action to run in the transaction.
     * @returns The promise of the transaction.
     */
    transaction(action: (dataProvider: DataProvider) => Promise<void>): Promise<void>;
    /**
     * Creates a raw filter for entity filtering.
     * @param {CustomSqlFilterBuilderFunction} build - The custom SQL filter builder function.
     * @returns {EntityFilter<any>} - The entity filter with a custom SQL filter.
     * @example
     * SqlDatabase.rawFilter(({param}) =>
          `"customerId" in (select id from customers where city = ${param(customerCity)})`
        )
     * @see [Leveraging Database Capabilities with Raw SQL in Custom Filters](https://remult.dev/docs/custom-filter.html#leveraging-database-capabilities-with-raw-sql-in-custom-filters)
     */
    static rawFilter(build: CustomSqlFilterBuilderFunction): EntityFilter<any>;
    /**
     *  Converts a filter to a raw SQL string.
     *  @see [Leveraging Database Capabilities with Raw SQL in Custom Filters](https://remult.dev/docs/running-sql-on-the-server#leveraging-entityfilter-for-sql-databases)
     
     */
    static filterToRaw<entityType>(repo: RepositoryOverloads<entityType>, condition: EntityFilter<entityType>, sqlCommand?: SqlCommandWithParameters, dbNames?: EntityDbNamesBase, wrapIdentifier?: (name: string) => string): Promise<string>;
    /**
     * `false` _(default)_ - No logging
     *
     * `true` - to log all queries to the console
     *
     * `oneLiner` - to log all queries to the console as one line
     *
     * a `function` - to log all queries to the console as a custom format
     * @example
     * SqlDatabase.LogToConsole = (duration, query, args) => { console.log("be crazy ;)") }
     */
    static LogToConsole: boolean | 'oneLiner' | ((duration: number, query: string, args: Record<string, any>) => void);
    /**
     * Threshold in milliseconds for logging queries to the console.
     */
    static durationThreshold: number;
    /**
     * Creates a new SQL database.
     * @param sql - The SQL implementation.
     * @example
     * const db = new SqlDatabase(new PostgresDataProvider(pgPool))
     */
    constructor(sql: SqlImplementation);
    provideMigrationBuilder: (builder: MigrationCode) => MigrationBuilder;
    private createdEntities;
    end: () => Promise<void>;
}
export declare function getRowAfterUpdate<entityType>(meta: EntityMetadata<entityType>, dataProvider: EntityDataProvider, data: any, id: any, operation: string): any;
export declare function groupByImpl(options: EntityDataProviderGroupByOptions | undefined, e: EntityDbNamesBase, r: SqlCommand, orderByNullFirst: boolean | undefined, limitSyntax: (limit: number, offset: number) => string): Promise<any[]>;
