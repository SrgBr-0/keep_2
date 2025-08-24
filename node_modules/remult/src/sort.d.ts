import type { FieldMetadata } from './column-interfaces.js';
import type { EntityMetadata, EntityOrderBy } from './remult3/remult3.js';
/**
 * The `Sort` class is used to describe sorting criteria for queries. It is mainly used internally,
 * but it provides a few useful functions for working with sorting.
 */
export declare class Sort {
    /**
     * Translates the current `Sort` instance into an `EntityOrderBy` object.
     *
     * @returns {EntityOrderBy<any>} An `EntityOrderBy` object representing the sort criteria.
     */
    toEntityOrderBy(): EntityOrderBy<any>;
    /**
     * Constructs a `Sort` instance with the provided sort segments.
     *
     * @param {...SortSegment[]} segments The sort segments to be included in the sort criteria.
     */
    constructor(...segments: SortSegment[]);
    /**
     * The segments of the sort criteria.
     *
     * @type {SortSegment[]}
     */
    Segments: SortSegment[];
    /**
     * Reverses the sort order of the current sort criteria.
     *
     * @returns {Sort} A new `Sort` instance with the reversed sort order.
     */
    reverse(): Sort;
    /**
     * Compares two objects based on the current sort criteria.
     *
     * @param {any} a The first object to compare.
     * @param {any} b The second object to compare.
     * @param {function(FieldMetadata): string} [getFieldKey] An optional function to get the field key for comparison.
     * @returns {number} A negative value if `a` should come before `b`, a positive value if `a` should come after `b`, or zero if they are equal.
     */
    compare(a: any, b: any, getFieldKey?: (field: FieldMetadata) => string): number;
    /**
     * Translates an `EntityOrderBy` to a `Sort` instance.
     *
     * @template T The entity type for the order by.
     * @param {EntityMetadata<T>} entityDefs The metadata of the entity associated with the order by.
     * @param {EntityOrderBy<T>} [orderBy] The `EntityOrderBy` to be translated.
     * @returns {Sort} A `Sort` instance representing the translated order by.
     */
    static translateOrderByToSort<T>(entityDefs: EntityMetadata<T>, orderBy: EntityOrderBy<T>): Sort;
    /**
     * Creates a unique `Sort` instance based on the provided `Sort` and the entity metadata.
     * This ensures that the sort criteria result in a unique ordering of entities.
     *
     * @template T The entity type for the sort.
     * @param {EntityMetadata<T>} entityMetadata The metadata of the entity associated with the sort.
     * @param {Sort} [orderBy] The `Sort` instance to be made unique.
     * @returns {Sort} A `Sort` instance representing the unique sort criteria.
     */
    static createUniqueSort<T>(entityMetadata: EntityMetadata<T>, orderBy?: Sort): Sort;
    /**
     * Creates a unique `EntityOrderBy` based on the provided `EntityOrderBy` and the entity metadata.
     * This ensures that the order by criteria result in a unique ordering of entities.
     *
     * @template T The entity type for the order by.
     * @param {EntityMetadata<T>} entityMetadata The metadata of the entity associated with the order by.
     * @param {EntityOrderBy<T>} [orderBy] The `EntityOrderBy` to be made unique.
     * @returns {EntityOrderBy<T>} An `EntityOrderBy` representing the unique order by criteria.
     */
    static createUniqueEntityOrderBy<T>(entityMetadata: EntityMetadata<T>, orderBy?: EntityOrderBy<T>): EntityOrderBy<T>;
}
export interface SortSegment {
    field: FieldMetadata;
    isDescending?: boolean;
}
export declare function compareForSort(left: any, right: any, descending: boolean | undefined): number;
export declare function fixValueForSort(a: any): any;
