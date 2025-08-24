import type { MigrationBuilder } from './migration-types.js';
export declare function compareMigrationSnapshot({ entities, snapshot, migrationBuilder, reporter, }: {
    entities: any[];
    snapshot: EntitiesSnapshot;
    migrationBuilder: Required<MigrationBuilder>;
    reporter: (what: string) => void;
}): Promise<{
    version: number;
    entities: Record<string, {
        key: string;
        className: string;
        columns: Record<string, {
            key: string;
        }>;
    }>;
}>;
export declare function emptySnapshot(): {
    version: number;
    entities: Record<string, {
        key: string;
        className: string;
        columns: Record<string, {
            key: string;
        }>;
    }>;
};
export type EntitiesSnapshot = ReturnType<typeof emptySnapshot>;
