import type { FieldMetadata } from '../column-interfaces.js';
import type { EntityMetadataOverloads, RepositoryOverloads } from '../remult3/RepositoryImplementation.js';
import type { EntityFilter, EntityMetadata, MembersOnly } from '../remult3/remult3.js';
import type { HasWrapIdentifier, SqlCommandWithParameters } from '../sql-command.js';
import type { Filter, FilterConsumer } from './filter-interfaces.js';
export declare class FilterConsumerBridgeToSqlRequest implements FilterConsumer {
    private r;
    private nameProvider;
    private where;
    _addWhere: boolean;
    promises: Promise<void>[];
    resolveWhere(): Promise<string>;
    constructor(r: SqlCommandWithParameters, nameProvider: EntityDbNamesBase);
    custom(key: string, customItem: any): void;
    or(orElements: Filter[]): void;
    not(element: Filter): void;
    isNull(col: FieldMetadata): void;
    isNotNull(col: FieldMetadata): void;
    isIn(col: FieldMetadata, val: any[]): void;
    isEqualTo(col: FieldMetadata, val: any): void;
    isDifferentFrom(col: FieldMetadata, val: any): void;
    isGreaterOrEqualTo(col: FieldMetadata, val: any): void;
    isGreaterThan(col: FieldMetadata, val: any): void;
    isLessOrEqualTo(col: FieldMetadata, val: any): void;
    isLessThan(col: FieldMetadata, val: any): void;
    containsCaseInsensitive(col: FieldMetadata, val: any): void;
    notContainsCaseInsensitive(col: FieldMetadata, val: any): void;
    startsWithCaseInsensitive(col: FieldMetadata, val: any): void;
    endsWithCaseInsensitive(col: FieldMetadata, val: any): void;
    private add;
    private addToWhere;
    databaseCustom(databaseCustom: CustomSqlFilterObject): void;
}
export interface CustomSqlFilterObject {
    buildSql: CustomSqlFilterBuilderFunction;
}
/**
 * Represents a custom SQL filter builder function.
 * @callback CustomSqlFilterBuilderFunction
 * @param {CustomSqlFilterBuilder} builder - The custom SQL filter builder instance.
 * @returns {void | string | Promise<string | void> } - The result of the custom SQL filter builder function.
 */
export type CustomSqlFilterBuilderFunction = (builder: CustomSqlFilterBuilder) => void | string | Promise<string | void>;
/**
 * Represents a custom SQL filter builder.
 */
export declare class CustomSqlFilterBuilder implements SqlCommandWithParameters, HasWrapIdentifier {
    private r;
    wrapIdentifier: (name: string) => string;
    constructor(r: SqlCommandWithParameters, wrapIdentifier: (name: string) => string);
    sql: string;
    /** @deprecated  use `param` instead*/
    addParameterAndReturnSqlToken(val: any): string;
    /**
     * Adds a parameter value.
     * @param {valueType} val - The value to add as a parameter.
     * @param {FieldMetadata<valueType>} [field] - The field metadata.
     * @returns {string} - The SQL token.
     */
    param: <valueType>(val: valueType, field?: FieldMetadata<valueType>) => string;
    /**
     * Converts an entity filter into a raw SQL condition - and appends to it any `backendPrefilter` and `backendPreprocessFilter`
     * @param {RepositoryOverloads<entityType>} repo - The repository.
     * @param {EntityFilter<entityType>} condition - The entity filter.
     * @returns {Promise<string>} - The raw SQL.
     */
    filterToRaw: <entityType>(repo: RepositoryOverloads<entityType>, condition: EntityFilter<entityType>) => Promise<string>;
}
export declare function isDbReadonly<entityType>(field: FieldMetadata, dbNames: EntityDbNames<entityType>): boolean | "" | undefined;
export declare function shouldNotCreateField<entityType>(field: FieldMetadata, dbNames: EntityDbNames<entityType>): boolean;
export declare function shouldCreateEntity(entity: EntityMetadata, e: EntityDbNamesBase): boolean;
export declare type EntityDbNamesBase = {
    $entityName: string;
    $dbNameOf(field: FieldMetadata<any> | string): string;
    toString(): string;
    wrapIdentifier: (name: string) => string;
};
export declare type EntityDbNames<entityType> = {
    [Properties in keyof Required<MembersOnly<entityType>>]: string;
} & EntityDbNamesBase;
export interface dbNamesOfOptions {
    wrapIdentifier?: (name: string) => string;
    tableName?: boolean | string;
}
export declare function dbNamesOf<entityType>(repo: EntityMetadataOverloads<entityType>, wrapIdentifierOrOptions?: ((name: string) => string) | dbNamesOfOptions): Promise<EntityDbNames<entityType>>;
export declare function dbNamesOfWithForceSqlExpression<entityType>(repo: EntityMetadataOverloads<entityType>, wrapIdentifierOrOptions?: ((name: string) => string) | dbNamesOfOptions): Promise<EntityDbNames<entityType>>;
export declare function entityDbName(metadata: EntityMetadata, wrapIdentifier?: (name: string) => string): Promise<string>;
export declare function fieldDbName(f: FieldMetadata, meta: EntityMetadata, wrapIdentifier?: (name: string) => string, forceSqlExpression?: boolean): Promise<string>;
