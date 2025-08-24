import { SqliteCoreDataProvider } from "./remult-sqlite-core.js";
type Database = {
    close(): void;
    query(sql: string): {
        all(args?: any): any[];
    };
};
export declare class BunSqliteDataProvider extends SqliteCoreDataProvider {
    constructor(db: Database);
}
export {};
