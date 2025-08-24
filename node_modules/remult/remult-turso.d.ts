import type { SqlImplementation } from './index.js';
import { SqliteCoreDataProvider } from './remult-sqlite-core.js';
import type { Client } from '@libsql/client';
export declare class TursoDataProvider extends SqliteCoreDataProvider {
    private client;
    constructor(client: Pick<Client, 'execute'>);
    transaction(action: (sql: SqlImplementation) => Promise<void>): Promise<void>;
}
