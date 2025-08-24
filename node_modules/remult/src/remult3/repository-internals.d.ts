import type { FieldMetadata } from '../column-interfaces.js';
import type { EntityDataProviderFindOptions } from '../data-interfaces.js';
import type { Filter } from '../filter/filter-interfaces.js';
import type { EntityFilter, EntityOrderBy, FindOptions, LoadOptions, Repository } from './remult3.js';
export interface RepositoryInternal<entityType> {
    _createAfterFilter(orderBy: EntityOrderBy<entityType>, lastRow: entityType): Promise<EntityFilter<entityType>>;
    _fromJsonArray(jsonItems: any[], loadOptions: LoadOptions<entityType>): Promise<entityType[]>;
    _buildEntityDataProviderFindOptions(options: FindOptions<entityType>): Promise<EntityDataProviderFindOptions>;
    _translateWhereToFilter(where: EntityFilter<entityType>): Promise<Filter>;
    _getCachedById(id: any, doNotLoadIfNotFound: boolean): entityType | undefined;
    _getCachedByIdAsync(id: any, doNotLoadIfNotFound: boolean): Promise<entityType | undefined>;
    _addToCache(item: entityType): void;
    _getFocusedRelationRepo(field: FieldMetadata, item: any): {
        toRepo: Repository<any>;
        returnNull: boolean;
        returnUndefined: boolean;
    };
}
export declare function getRepositoryInternals<entityType>(repo: Repository<entityType>): RepositoryInternal<entityType>;
export declare const getInternalKey: unique symbol;
