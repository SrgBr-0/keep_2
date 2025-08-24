import type { ClassType } from '../../classType.js';
import { type EntityDbNames } from '../filter/filter-consumer-bridge-to-sql-request.js';
import type { EntityFilter, EntityOrderBy, ObjectMembersOnly } from '../remult3/remult3.js';
import type { SqlCommandWithParameters } from '../sql-command.js';
export declare function sqlRelations<entityType>(forEntity: ClassType<entityType>): SqlRelations<entityType>;
export type SqlRelations<entityType> = {
    [p in keyof ObjectMembersOnly<entityType>]-?: SqlRelation<ArrayItemType<NonNullable<entityType[p]>>>;
};
export type SubQueryWhat<toEntity> = (fieldNamesOfToEntity: EntityDbNames<toEntity>) => string | Promise<string>;
export type SubQueryOptions<toEntity> = {
    where?: EntityFilter<toEntity>;
    orderBy?: EntityOrderBy<toEntity>;
    first?: boolean;
    c?: SqlCommandWithParameters;
};
export type SqlFirst<toEntity> = {
    $subQuery(what: SubQueryWhat<toEntity>): Promise<string>;
    $relations: {
        [P in keyof ObjectMembersOnly<toEntity>]-?: SqlRelation<toEntity[P]>;
    };
} & {
    [P in keyof toEntity]-?: Promise<string>;
};
export type SqlRelation<toEntity> = {
    $count(where?: EntityFilter<toEntity>): Promise<string>;
    $subQuery(what: SubQueryWhat<toEntity>, options?: SubQueryOptions<toEntity>): Promise<string>;
    $relations: {
        [P in keyof ObjectMembersOnly<toEntity>]-?: SqlRelation<toEntity[P]>;
    };
    $first(options?: Pick<SubQueryOptions<toEntity>, 'where' | 'orderBy'>): SqlFirst<toEntity>;
} & {
    [P in keyof toEntity]-?: Promise<string>;
};
export type ArrayItemType<T> = T extends (infer U)[] ? U : T;
export declare function sqlRelationsFilter<entityType>(forEntity: ClassType<entityType>): { [p in keyof entityType]-?: SqlRelationFilter<entityType, p, ArrayItemType<NonNullable<entityType[p]>>>; };
export declare class SqlRelationFilter<myEntity, relationKey extends keyof myEntity, toEntity = ArrayItemType<myEntity[relationKey]>> {
    private _tools;
    constructor(myEntity: ClassType<myEntity>, relationField: relationKey);
    some(where?: EntityFilter<toEntity>): EntityFilter<toEntity>;
}
