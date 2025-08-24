import type { DataProvider, EntityDataProvider, EntityDataProviderGroupByOptions, EntityDataProviderFindOptions, ProxyEntityDataProvider, RestDataProviderHttpProvider } from '../data-interfaces.js';
import { UrlBuilder } from '../../urlBuilder.js';
import type { ApiClient } from '../context.js';
import { Filter } from '../filter/filter-interfaces.js';
import type { EntityMetadata } from '../remult3/remult3.js';
export declare class RestDataProvider implements DataProvider {
    private apiProvider;
    private entityRequested?;
    constructor(apiProvider: () => ApiClient, entityRequested?: ((entity: EntityMetadata) => void) | undefined);
    getEntityDataProvider(entity: EntityMetadata): RestEntityDataProvider;
    transaction(action: (dataProvider: DataProvider) => Promise<void>): Promise<void>;
    isProxy: boolean;
}
export declare function buildFullUrl(httpClientUrl: string | undefined, entityKey: string): string;
export declare class RestEntityDataProvider implements EntityDataProvider, ProxyEntityDataProvider {
    private url;
    private http;
    private entity;
    constructor(url: () => string, http: () => RestDataProviderHttpProvider, entity: EntityMetadata);
    query(options: EntityDataProviderFindOptions, aggregateOptions: EntityDataProviderGroupByOptions): Promise<{
        items: any[];
        aggregates: any;
    }>;
    groupBy(options?: EntityDataProviderGroupByOptions): Promise<any[]>;
    private buildAggregateOptions;
    translateFromJson(row: any): any;
    translateToJson(row: any): any;
    count(where: Filter): Promise<number>;
    deleteMany(where: Filter): Promise<number>;
    updateMany(where: Filter, data: any): Promise<number>;
    upsertMany(options: {
        where: any;
        set: any;
    }[]): Promise<any[]>;
    find(options?: EntityDataProviderFindOptions): Promise<Array<any>>;
    update(id: any, data: any): Promise<any>;
    private toJsonOfIncludedKeys;
    delete(id: any): Promise<void>;
    insert(data: any): Promise<any>;
    insertMany(data: any[]): Promise<any[]>;
}
export declare class RestDataProviderHttpProviderUsingFetch implements RestDataProviderHttpProvider {
    private fetch?;
    constructor(fetch?: ((input: RequestInfo, init?: RequestInit) => Promise<Response>) | undefined);
    get(url: string): Promise<any>;
    put(url: string, data: any): Promise<any>;
    delete(url: string): Promise<any>;
    post(url: string, data: any): Promise<any>;
    myFetch(url: string, options?: {
        method?: string;
        body?: string;
    }): Promise<any>;
}
export declare function addFilterToUrlAndReturnTrueIfSuccessful(filter: any, url: UrlBuilder): boolean;
export declare const liveQueryAction = "liveQuery-";
