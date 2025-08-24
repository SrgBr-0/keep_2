import { type DataProvider } from '../index.js';
import type { Migrations } from './migration-types.js';
/**
 * Applies migration scripts to update the database schema.
 *
 * @param options - Configuration options for applying migrations.
 * @param options.migrations - An object containing the migration scripts, each keyed by a unique identifier.
 * @param options.dataProvider - The data provider instance or a function returning a promise of the data provider.
 * @param options.migrationsTable - (Optional) The name of the table that tracks applied migrations. Default is '__remult_migrations_version'.
 * @param options.endConnection - (Optional) Determines whether to close the database connection after applying migrations. Default is false.
 * @param options.beforeMigration - (Optional) A callback function that is called before each migration is applied. Receives an object with the migration index.
 * @param options.afterMigration - (Optional) A callback function that is called after each migration is applied. Receives an object with the migration index and the duration of the migration.
 * @see [Migrations](https://remult.dev/docs/migrations.html)
 */
export declare function migrate(options: {
    migrations: Migrations;
    dataProvider: DataProvider | Promise<DataProvider> | (() => Promise<DataProvider | undefined>);
    migrationsTable?: string;
    endConnection?: boolean;
    beforeMigration?: (info: {
        index: number;
    }) => void | Promise<void>;
    afterMigration?: (info: {
        index: number;
        duration: number;
    }) => void | Promise<void>;
}): Promise<void>;
