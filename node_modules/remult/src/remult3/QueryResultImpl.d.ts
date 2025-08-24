import type { QueryResult, QueryOptions, EntityFilter, Paginator } from './remult3.js';
import type { RepositoryImplementation } from './RepositoryImplementation.js';
export declare class QueryResultImpl<entityType> implements QueryResult<entityType> {
    private options;
    private repo;
    constructor(options: QueryOptions<entityType>, repo: RepositoryImplementation<entityType>);
    private _count;
    private _aggregates;
    getPage(page?: number): Promise<entityType[]>;
    count(): Promise<number>;
    forEach(what: (item: entityType) => Promise<any>): Promise<number>;
    paginator(pNextPageFilter?: EntityFilter<entityType>): Promise<Paginator<entityType>>;
    [Symbol.asyncIterator](): {
        next: () => Promise<IteratorResult<entityType, any>>;
    };
}
