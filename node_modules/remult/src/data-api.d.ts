import type { Remult } from './context.js';
import { type ErrorInfo } from './data-interfaces.js';
import { type EntityMetadata, type FindOptions, type Repository } from './remult3/remult3.js';
import type { rowHelperImplementation } from './remult3/RepositoryImplementation.js';
export declare class DataApi<T = unknown> {
    private repository;
    private remult;
    constructor(repository: Repository<T>, remult: Remult);
    httpGet(res: DataApiResponse, req: DataApiRequest, serializeContext: () => Promise<any>): void | Promise<void>;
    httpPost(res: DataApiResponse, req: DataApiRequest, body: any, serializeContext: () => Promise<any>): Promise<void>;
    upsertMany(response: DataApiResponse, request: DataApiRequest, body: any): Promise<void>;
    query(response: DataApiResponse, request: DataApiRequest, body: any): Promise<{
        items: any[];
        aggregates: import("./remult3/remult3.js").GroupByResult<T, any[], any[], any[], any[], any[], any[]>;
    } | undefined>;
    static defaultGetLimit: number;
    get(response: DataApiResponse, id: any): Promise<void>;
    count(response: DataApiResponse, request: DataApiRequest, body?: any): Promise<void>;
    deleteMany(response: DataApiResponse, request: DataApiRequest, body?: any): Promise<void>;
    groupBy(request: DataApiRequest, body: any): Promise<import("./remult3/remult3.js").GroupByResult<T, any[], any[], any[], any[], any[], any[]>[]>;
    getArrayImpl(request: DataApiRequest, body: any): Promise<{
        r: any[];
        findOptions: FindOptions<T>;
    }>;
    private findOptionsFromRequest;
    private includeNone;
    getArray(response: DataApiResponse, request: DataApiRequest, body?: any): Promise<void>;
    liveQuery(response: DataApiResponse, request: DataApiRequest, body: any, serializeContext: () => Promise<any>, queryChannel: string): Promise<void>;
    private buildWhere;
    private doOnId;
    updateManyThroughPutRequest(response: DataApiResponse, request: DataApiRequest, body: any): Promise<void>;
    updateManyImplementation(response: DataApiResponse, request: DataApiRequest, body: {
        where?: any;
        set?: any;
    }): Promise<void>;
    actualUpdate(row: any, body: any): Promise<rowHelperImplementation<T>>;
    put(response: DataApiResponse, id: any, body: any): Promise<void>;
    actualDelete(row: any): Promise<void>;
    delete(response: DataApiResponse, id: any): Promise<void>;
    post(body: any): Promise<any>;
}
export interface DataApiResponse {
    success(data: any): void;
    deleted(): void;
    created(data: any): void;
    notFound(): void;
    error(data: ErrorInfo, entity: EntityMetadata | undefined, statusCode?: number | undefined): void;
    forbidden(message?: string): void;
    progress(progress: number): void;
}
export interface DataApiRequest {
    get(key: string): any;
}
export declare function determineSort(sortUrlParm: string, dirUrlParam: string): any;
export declare function serializeError(data: ErrorInfo): ErrorInfo<unknown>;
