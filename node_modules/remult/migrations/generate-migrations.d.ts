import type { DataProvider } from '../index.js';
/**
 * Generates migration scripts based on changes in entities.
 *
 * @param options - Configuration options for generating migrations.
 * @param options.entities - An array of entity classes whose changes will be included in the migration.
 * @param options.dataProvider - The data provider instance or a function returning a promise of the data provider.
 * @param options.migrationsFolder - (Optional) The path to the folder where migration scripts will be stored. Default is 'src/migrations'.
 * @param options.snapshotFile - (Optional) The path to the file where the snapshot of the last known state will be stored. Default is 'migrations-snapshot.json' in the `migrationsFolder`.
 * @param options.migrationsTSFile - (Optional) The path to the TypeScript file where the generated migrations will be written. Default is 'migrations.ts' in the `migrationsFolder`.
 * @param options.endConnection - (Optional) Determines whether to close the database connection after generating migrations. Default is false.
 * @see [Migrations](https://remult.dev/docs/migrations.html)
 */
export declare function generateMigrations(options: {
    entities: any[];
    dataProvider: DataProvider | Promise<DataProvider> | (() => Promise<DataProvider | undefined>);
    migrationsFolder?: string;
    snapshotFile?: string;
    migrationsTSFile?: string;
    endConnection?: boolean;
}): Promise<boolean>;
