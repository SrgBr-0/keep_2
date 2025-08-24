import type { FieldMetadata } from '../column-interfaces.js';
import type { Remult } from '../context.js';
import type { EntityFilter, EntityMetadata, MembersOnly } from '../remult3/remult3.js';
/**
 * The `Filter` class is a helper class that focuses on filter-related concerns. It provides methods
 * for creating and applying filters in queries.
 */
export declare class Filter {
    private apply;
    /**
     * Retrieves precise values for each property in a filter for an entity.
     * @template entityType The type of the entity being filtered.
     * @param metadata The metadata of the entity being filtered.
     * @param filter The filter to analyze.
     * @returns A promise that resolves to a FilterPreciseValues object containing the precise values for each property.
     * @example
     * const preciseValues = await Filter.getPreciseValues(meta, {
     *   status: { $ne: 'active' },
     *   $or: [
     *     { customerId: ["1", "2"] },
     *     { customerId: "3" }
     *   ]
     * });
     * console.log(preciseValues);
     * // Output:
     * // {
     * //   "customerId": ["1", "2", "3"], // Precise values inferred from the filter
     * //   "status": undefined,           // Cannot infer precise values for 'status'
     * // }
    
     */
    static getPreciseValues<entityType>(metadata: EntityMetadata<entityType>, filter: EntityFilter<entityType>): Promise<FilterPreciseValues<entityType>>;
    /**
     * Retrieves precise values for each property in a filter for an entity.
     * @template entityType The type of the entity being filtered.
     * @param metadata The metadata of the entity being filtered.
     * @param filter The filter to analyze.
     * @returns A promise that resolves to a FilterPreciseValues object containing the precise values for each property.
     * @example
     * const preciseValues = await where.getPreciseValues();
     * console.log(preciseValues);
     * // Output:
     * // {
     * //   "customerId": ["1", "2", "3"], // Precise values inferred from the filter
     * //   "status": undefined,           // Cannot infer precise values for 'status'
     * // }
    
     */
    getPreciseValues<entityType>(): Promise<FilterPreciseValues<entityType>>;
    /**
     * Creates a custom filter. Custom filters are evaluated on the backend, ensuring security and efficiency.
     * When the filter is used in the frontend, only its name is sent to the backend via the API,
     * where the filter gets translated and applied in a safe manner.
     *
     * @template entityType The entity type for the filter.
     * @param {function(): EntityFilter<entityType>} translator A function that returns an `EntityFilter`.
     * @param {string} [key] An optional unique identifier for the custom filter.
     * @returns {function(): EntityFilter<entityType>} A function that returns an `EntityFilter` of type `entityType`.
     *
     * @example
     *  class Order {
     *  //...
     *  static activeOrdersFor = Filter.createCustom<Order, { year: number }>(
     *    async ({ year }) => {
     *      return {
     *        status: ['created', 'confirmed', 'pending', 'blocked', 'delayed'],
     *        createdAt: {
     *          $gte: new Date(year, 0, 1),
     *          $lt: new Date(year + 1, 0, 1),
     *        },
     *      }
     *    },
     *  )
     *}
     * // Usage
     * await repo(Order).find({
     *  where: Order.activeOrders({ year }),
     *})
  
  
     * @see
     * [Sql filter and Custom filter](/docs/custom-filter.html)
     * [Filtering and Relations](/docs/filtering-and-relations.html)
     */
    static createCustom<entityType>(translator: (unused: never, r: Remult) => EntityFilter<entityType> | Promise<EntityFilter<entityType>>, key?: string): (() => EntityFilter<entityType>) & customFilterInfo<entityType>;
    /**
     * Creates a custom filter. Custom filters are evaluated on the backend, ensuring security and efficiency.
     * When the filter is used in the frontend, only its name is sent to the backend via the API,
     * where the filter gets translated and applied in a safe manner.
     *
     * @template entityType The entity type for the filter.
     * @param {function(): EntityFilter<entityType>} translator A function that returns an `EntityFilter`.
     * @param {string} [key] An optional unique identifier for the custom filter.
     * @returns {function(): EntityFilter<entityType>} A function that returns an `EntityFilter` of type `entityType`.
     *
     * @example
     *  class Order {
     *  //...
     *  static activeOrdersFor = Filter.createCustom<Order, { year: number }>(
     *    async ({ year }) => {
     *      return {
     *        status: ['created', 'confirmed', 'pending', 'blocked', 'delayed'],
     *        createdAt: {
     *          $gte: new Date(year, 0, 1),
     *          $lt: new Date(year + 1, 0, 1),
     *        },
     *      }
     *    },
     *  )
     *}
     * // Usage
     * await repo(Order).find({
     *  where: Order.activeOrders({ year }),
     *})
  
     
     * @see
     * [Sql filter and Custom filter](/docs/custom-filter.html)
     * [Filtering and Relations](/docs/filtering-and-relations.html)
     */
    static createCustom<entityType, argsType>(translator: (args: argsType, r: Remult) => EntityFilter<entityType> | Promise<EntityFilter<entityType>>, key?: string): ((y: argsType) => EntityFilter<entityType>) & customFilterInfo<entityType>;
    /**
     * Translates an `EntityFilter` to a plain JSON object that can be stored or transported.
     *
     * @template T The entity type for the filter.
     * @param {EntityMetadata<T>} entityDefs The metadata of the entity associated with the filter.
     * @param {EntityFilter<T>} where The `EntityFilter` to be translated.
     * @returns {any} A plain JSON object representing the `EntityFilter`.
     *
     * @example
     * // Assuming `Task` is an entity class
     * const jsonFilter = Filter.entityFilterToJson(Task, { completed: true });
     * // `jsonFilter` can now be stored or transported as JSON
     */
    static entityFilterToJson<T>(entityDefs: EntityMetadata<T>, where: EntityFilter<T>): any;
    /**
     * Translates a plain JSON object back into an `EntityFilter`.
     *
     * @template T The entity type for the filter.
     * @param {EntityMetadata<T>} entityDefs The metadata of the entity associated with the filter.
     * @param {any} packed The plain JSON object representing the `EntityFilter`.
     * @returns {EntityFilter<T>} The reconstructed `EntityFilter`.
     *
     * @example
     * // Assuming `Task` is an entity class and `jsonFilter` is a JSON object representing an EntityFilter
     * const taskFilter = Filter.entityFilterFromJson(Task, jsonFilter);
     * // Using the reconstructed `EntityFilter` in a query
     * const tasks = await remult.repo(Task).find({ where: taskFilter });
     * for (const task of tasks) {
     *   // Do something for each task based on the filter
     * }
     */
    static entityFilterFromJson<T>(entityDefs: EntityMetadata<T>, packed: any): EntityFilter<T>;
    /**
     * Converts an `EntityFilter` to a `Filter` that can be used by the `DataProvider`. This method is
     * mainly used internally.
     *
     * @template T The entity type for the filter.
     * @param {EntityMetadata<T>} entity The metadata of the entity associated with the filter.
     * @param {EntityFilter<T>} whereItem The `EntityFilter` to be converted.
     * @returns {Filter} A `Filter` instance that can be used by the `DataProvider`.
     *
     * @example
     * // Assuming `Task` is an entity class and `taskFilter` is an EntityFilter
     * const filter = Filter.fromEntityFilter(Task, taskFilter);
     * // `filter` can now be used with the DataProvider
     */
    static fromEntityFilter<T>(entity: EntityMetadata<T>, whereItem: EntityFilter<T>): Filter;
    constructor(apply: (add: FilterConsumer) => void);
    __applyToConsumer(add: FilterConsumer): void;
    /**
     * Resolves an entity filter.
     *
     * This method takes a filter which can be either an instance of `EntityFilter`
     * or a function that returns an instance of `EntityFilter` or a promise that
     * resolves to an instance of `EntityFilter`. It then resolves the filter if it
     * is a function and returns the resulting `EntityFilter`.
     *
     * @template entityType The type of the entity that the filter applies to.
     * @param {EntityFilter<entityType> | (() => EntityFilter<entityType> | Promise<EntityFilter<entityType>>)} filter The filter to resolve.
     * @returns {Promise<EntityFilter<entityType>>} The resolved entity filter.
     */
    static resolve<entityType>(filter: EntityFilter<entityType> | (() => EntityFilter<entityType> | Promise<EntityFilter<entityType>>)): Promise<EntityFilter<entityType>>;
    toJson(): any;
    static translateCustomWhere<T>(r: Filter, entity: EntityMetadata<T>, remult: Remult): Promise<Filter>;
}
export interface FilterConsumer {
    or(orElements: Filter[]): void;
    not(filter: Filter): void;
    isEqualTo(col: FieldMetadata, val: any): void;
    isDifferentFrom(col: FieldMetadata, val: any): void;
    isNull(col: FieldMetadata): void;
    isNotNull(col: FieldMetadata): void;
    isGreaterOrEqualTo(col: FieldMetadata, val: any): void;
    isGreaterThan(col: FieldMetadata, val: any): void;
    isLessOrEqualTo(col: FieldMetadata, val: any): void;
    isLessThan(col: FieldMetadata, val: any): void;
    containsCaseInsensitive(col: FieldMetadata, val: any): void;
    notContainsCaseInsensitive(col: FieldMetadata, val: any): void;
    startsWithCaseInsensitive(col: FieldMetadata, val: any): void;
    endsWithCaseInsensitive(col: FieldMetadata, val: any): void;
    isIn(col: FieldMetadata, val: any[]): void;
    custom(key: string, customItem: any): void;
    databaseCustom(databaseCustom: any): void;
}
export declare class AndFilter extends Filter {
    readonly filters: Filter[];
    constructor(...filters: Filter[]);
    add(filter: Filter): void;
}
export declare class OrFilter extends Filter {
    readonly filters: Filter[];
    constructor(...filters: Filter[]);
}
export declare class NotFilter extends Filter {
    readonly filter: Filter;
    constructor(filter: Filter);
}
export declare const customUrlToken = "$custom$";
export declare const customDatabaseFilterToken = "$db$";
export declare class FilterSerializer implements FilterConsumer {
    result: any;
    constructor();
    databaseCustom(databaseCustom: any): void;
    custom(key: string, customItem: any): void;
    hasUndefined: boolean;
    add(key: string, val: any): void;
    or(orElements: Filter[]): void;
    not(filter: Filter): void;
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
}
export declare function entityFilterToJson<T>(entityDefs: EntityMetadata<T>, where: EntityFilter<T>): any;
export declare function buildFilterFromRequestParameters(entity: EntityMetadata, filterInfo: {
    get: (key: string) => any;
}): EntityFilter<any>;
export interface customFilterInfo<entityType> {
    rawFilterInfo: {
        key: string;
        rawFilterTranslator: (args: any, r: Remult) => EntityFilter<entityType> | Promise<EntityFilter<entityType>>;
    };
}
export declare function __updateEntityBasedOnWhere<T>(entityDefs: EntityMetadata<T>, where: EntityFilter<T>, r: T): void;
/**
 * A mapping of property names to arrays of precise values for those properties.
 * @example
 * const preciseValues = await getPreciseValues(meta, {
 *   status: { $ne: 'active' },
 *   $or: [
 *     { customerId: ["1", "2"] },
 *     { customerId: "3" }
 *   ]
 * });
 * console.log(preciseValues);
 * // Output:
 * // {
 * //   "customerId": ["1", "2", "3"], // Precise values inferred from the filter
 * //   "status": undefined,           // Cannot infer precise values for 'status'
 * // }
 */
export type FilterPreciseValues<entityType> = {
    [Properties in keyof MembersOnly<entityType>]?: Partial<entityType[Properties]>[];
};
