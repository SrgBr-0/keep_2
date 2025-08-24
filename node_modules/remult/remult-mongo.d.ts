import { type ClientSession, type Db, type MongoClient } from 'mongodb';
import type { DataProvider, EntityDataProvider, EntityFilter, EntityMetadata } from './index.js';
import type { RepositoryOverloads } from './src/remult3/RepositoryImplementation.js';
export declare class MongoDataProvider implements DataProvider {
    private db;
    private client;
    constructor(db: Db, client: MongoClient | undefined, options?: {
        session?: ClientSession;
        disableTransactions?: boolean;
    });
    session?: ClientSession;
    disableTransactions: boolean;
    static getDb(dataProvider?: DataProvider): {
        db: Db;
        session: ClientSession | undefined;
    };
    ensureSchema(entities: EntityMetadata[]): Promise<void>;
    getEntityDataProvider(entity: EntityMetadata): EntityDataProvider;
    transaction(action: (dataProvider: DataProvider) => Promise<void>): Promise<void>;
    static filterToRaw<entityType>(entity: RepositoryOverloads<entityType>, condition: EntityFilter<entityType>): Promise<{
        $and: any[];
    } | {
        $and?: undefined;
    }>;
}
