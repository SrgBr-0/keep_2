import { getRelationFieldInfo } from './remult3/relationInfoMember.js';
/**
 * The `Sort` class is used to describe sorting criteria for queries. It is mainly used internally,
 * but it provides a few useful functions for working with sorting.
 */
export class Sort {
    /**
     * Translates the current `Sort` instance into an `EntityOrderBy` object.
     *
     * @returns {EntityOrderBy<any>} An `EntityOrderBy` object representing the sort criteria.
     */
    toEntityOrderBy() {
        let result = {};
        for (const seg of this.Segments) {
            if (seg.isDescending) {
                result[seg.field.key] = 'desc';
            }
            else
                result[seg.field.key] = 'asc';
        }
        return result;
    }
    /**
     * Constructs a `Sort` instance with the provided sort segments.
     *
     * @param {...SortSegment[]} segments The sort segments to be included in the sort criteria.
     */
    constructor(...segments) {
        this.Segments = segments;
    }
    /**
     * The segments of the sort criteria.
     *
     * @type {SortSegment[]}
     */
    Segments;
    /**
     * Reverses the sort order of the current sort criteria.
     *
     * @returns {Sort} A new `Sort` instance with the reversed sort order.
     */
    reverse() {
        let r = new Sort();
        for (const s of this.Segments) {
            r.Segments.push({ field: s.field, isDescending: !s.isDescending });
        }
        return r;
    }
    /**
     * Compares two objects based on the current sort criteria.
     *
     * @param {any} a The first object to compare.
     * @param {any} b The second object to compare.
     * @param {function(FieldMetadata): string} [getFieldKey] An optional function to get the field key for comparison.
     * @returns {number} A negative value if `a` should come before `b`, a positive value if `a` should come after `b`, or zero if they are equal.
     */
    compare(a, b, getFieldKey) {
        if (!getFieldKey)
            getFieldKey = (x) => x.key;
        for (let i = 0; i < this.Segments.length; i++) {
            let seg = this.Segments[i];
            let left = a[getFieldKey(seg.field)];
            let right = b[getFieldKey(seg.field)];
            let descending = seg.isDescending;
            let r = compareForSort(left, right, descending);
            if (r != 0) {
                return r;
            }
        }
        return 0;
    }
    /**
     * Translates an `EntityOrderBy` to a `Sort` instance.
     *
     * @template T The entity type for the order by.
     * @param {EntityMetadata<T>} entityDefs The metadata of the entity associated with the order by.
     * @param {EntityOrderBy<T>} [orderBy] The `EntityOrderBy` to be translated.
     * @returns {Sort} A `Sort` instance representing the translated order by.
     */
    static translateOrderByToSort(entityDefs, orderBy) {
        let sort = new Sort();
        if (orderBy)
            for (const key in orderBy) {
                if (Object.prototype.hasOwnProperty.call(orderBy, key)) {
                    const element = orderBy[key];
                    let field = entityDefs.fields.find(key);
                    const addSegment = (field) => {
                        switch (element) {
                            case 'desc':
                                sort.Segments.push({ field, isDescending: true });
                                break;
                            case 'asc':
                                sort.Segments.push({ field });
                        }
                    };
                    if (field) {
                        const rel = getRelationFieldInfo(field);
                        if (rel?.type === 'toOne') {
                            const op = rel.options;
                            if (typeof op.field === 'string') {
                                addSegment(entityDefs.fields.find(op.field));
                            }
                            else {
                                if (op.fields) {
                                    for (const key in op.fields) {
                                        if (Object.prototype.hasOwnProperty.call(op.fields, key)) {
                                            const keyInMyEntity = op.fields[key];
                                            addSegment(entityDefs.fields.find(keyInMyEntity.toString()));
                                        }
                                    }
                                }
                            }
                        }
                        else
                            addSegment(field);
                    }
                }
            }
        return sort;
    }
    /**
     * Creates a unique `Sort` instance based on the provided `Sort` and the entity metadata.
     * This ensures that the sort criteria result in a unique ordering of entities.
     *
     * @template T The entity type for the sort.
     * @param {EntityMetadata<T>} entityMetadata The metadata of the entity associated with the sort.
     * @param {Sort} [orderBy] The `Sort` instance to be made unique.
     * @returns {Sort} A `Sort` instance representing the unique sort criteria.
     */
    static createUniqueSort(entityMetadata, orderBy) {
        if ((!orderBy || Object.keys(orderBy).length === 0) &&
            entityMetadata.options.defaultOrderBy)
            orderBy = Sort.translateOrderByToSort(entityMetadata, entityMetadata.options.defaultOrderBy);
        if (!orderBy)
            orderBy = new Sort();
        for (const field of entityMetadata.idMetadata.fields) {
            if (!orderBy.Segments.find((x) => x.field == field)) {
                orderBy.Segments.push({ field: field });
            }
        }
        return orderBy;
    }
    /**
     * Creates a unique `EntityOrderBy` based on the provided `EntityOrderBy` and the entity metadata.
     * This ensures that the order by criteria result in a unique ordering of entities.
     *
     * @template T The entity type for the order by.
     * @param {EntityMetadata<T>} entityMetadata The metadata of the entity associated with the order by.
     * @param {EntityOrderBy<T>} [orderBy] The `EntityOrderBy` to be made unique.
     * @returns {EntityOrderBy<T>} An `EntityOrderBy` representing the unique order by criteria.
     */
    static createUniqueEntityOrderBy(entityMetadata, orderBy) {
        if (!orderBy || Object.keys(orderBy).length === 0)
            orderBy = entityMetadata.options.defaultOrderBy;
        if (!orderBy)
            orderBy = {};
        else
            orderBy = { ...orderBy };
        for (const field of entityMetadata.idMetadata.fields) {
            if (!orderBy[field.key]) {
                orderBy[field.key] = 'asc';
            }
        }
        return orderBy;
    }
}
export function compareForSort(left, right, descending) {
    left = fixValueForSort(left);
    right = fixValueForSort(right);
    let r = 0;
    if (left > right)
        r = 1;
    else if (left < right)
        r = -1;
    if (descending)
        r *= -1;
    return r;
}
export function fixValueForSort(a) {
    if (a == undefined || a == null)
        return a;
    if (a.id !== undefined)
        return a.id;
    return a;
}
