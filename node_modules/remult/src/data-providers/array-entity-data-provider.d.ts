import type { EntityDataProvider, EntityDataProviderGroupByOptions, EntityDataProviderFindOptions } from '../data-interfaces.js';
import { Filter } from '../filter/filter-interfaces.js';
import { type EntityFilter, type EntityMetadata } from '../remult3/remult3.js';
export declare class ArrayEntityDataProvider implements EntityDataProvider {
    private entity;
    private rows;
    static rawFilter(filter: CustomArrayFilter): EntityFilter<any>;
    constructor(entity: EntityMetadata, rows: () => any[]);
    groupBy(options?: EntityDataProviderGroupByOptions): Promise<any[]>;
    count(where?: Filter): Promise<number>;
    find(options?: EntityDataProviderFindOptions): Promise<any[]>;
    update(id: any, data: any): Promise<any>;
    delete(id: any): Promise<void>;
    insert(data: any): Promise<any>;
}
export type CustomArrayFilter = (item: any) => boolean;
export interface CustomArrayFilterObject {
    arrayFilter: CustomArrayFilter;
}
