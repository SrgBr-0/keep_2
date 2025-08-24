"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sort = void 0;
exports.compareForSort = compareForSort;
exports.fixValueForSort = fixValueForSort;
var tslib_1 = require("tslib");
var relationInfoMember_js_1 = require("./remult3/relationInfoMember.js");
/**
 * The `Sort` class is used to describe sorting criteria for queries. It is mainly used internally,
 * but it provides a few useful functions for working with sorting.
 */
var Sort = /** @class */ (function () {
    /**
     * Constructs a `Sort` instance with the provided sort segments.
     *
     * @param {...SortSegment[]} segments The sort segments to be included in the sort criteria.
     */
    function Sort() {
        var segments = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            segments[_i] = arguments[_i];
        }
        this.Segments = segments;
    }
    /**
     * Translates the current `Sort` instance into an `EntityOrderBy` object.
     *
     * @returns {EntityOrderBy<any>} An `EntityOrderBy` object representing the sort criteria.
     */
    Sort.prototype.toEntityOrderBy = function () {
        var e_1, _a;
        var result = {};
        try {
            for (var _b = tslib_1.__values(this.Segments), _c = _b.next(); !_c.done; _c = _b.next()) {
                var seg = _c.value;
                if (seg.isDescending) {
                    result[seg.field.key] = 'desc';
                }
                else
                    result[seg.field.key] = 'asc';
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return result;
    };
    /**
     * Reverses the sort order of the current sort criteria.
     *
     * @returns {Sort} A new `Sort` instance with the reversed sort order.
     */
    Sort.prototype.reverse = function () {
        var e_2, _a;
        var r = new Sort();
        try {
            for (var _b = tslib_1.__values(this.Segments), _c = _b.next(); !_c.done; _c = _b.next()) {
                var s = _c.value;
                r.Segments.push({ field: s.field, isDescending: !s.isDescending });
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return r;
    };
    /**
     * Compares two objects based on the current sort criteria.
     *
     * @param {any} a The first object to compare.
     * @param {any} b The second object to compare.
     * @param {function(FieldMetadata): string} [getFieldKey] An optional function to get the field key for comparison.
     * @returns {number} A negative value if `a` should come before `b`, a positive value if `a` should come after `b`, or zero if they are equal.
     */
    Sort.prototype.compare = function (a, b, getFieldKey) {
        if (!getFieldKey)
            getFieldKey = function (x) { return x.key; };
        for (var i = 0; i < this.Segments.length; i++) {
            var seg = this.Segments[i];
            var left = a[getFieldKey(seg.field)];
            var right = b[getFieldKey(seg.field)];
            var descending = seg.isDescending;
            var r = compareForSort(left, right, descending);
            if (r != 0) {
                return r;
            }
        }
        return 0;
    };
    /**
     * Translates an `EntityOrderBy` to a `Sort` instance.
     *
     * @template T The entity type for the order by.
     * @param {EntityMetadata<T>} entityDefs The metadata of the entity associated with the order by.
     * @param {EntityOrderBy<T>} [orderBy] The `EntityOrderBy` to be translated.
     * @returns {Sort} A `Sort` instance representing the translated order by.
     */
    Sort.translateOrderByToSort = function (entityDefs, orderBy) {
        var sort = new Sort();
        if (orderBy) {
            var _loop_1 = function (key) {
                if (Object.prototype.hasOwnProperty.call(orderBy, key)) {
                    var element_1 = orderBy[key];
                    var field = entityDefs.fields.find(key);
                    var addSegment = function (field) {
                        switch (element_1) {
                            case 'desc':
                                sort.Segments.push({ field: field, isDescending: true });
                                break;
                            case 'asc':
                                sort.Segments.push({ field: field });
                        }
                    };
                    if (field) {
                        var rel = (0, relationInfoMember_js_1.getRelationFieldInfo)(field);
                        if ((rel === null || rel === void 0 ? void 0 : rel.type) === 'toOne') {
                            var op = rel.options;
                            if (typeof op.field === 'string') {
                                addSegment(entityDefs.fields.find(op.field));
                            }
                            else {
                                if (op.fields) {
                                    for (var key_1 in op.fields) {
                                        if (Object.prototype.hasOwnProperty.call(op.fields, key_1)) {
                                            var keyInMyEntity = op.fields[key_1];
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
            };
            for (var key in orderBy) {
                _loop_1(key);
            }
        }
        return sort;
    };
    /**
     * Creates a unique `Sort` instance based on the provided `Sort` and the entity metadata.
     * This ensures that the sort criteria result in a unique ordering of entities.
     *
     * @template T The entity type for the sort.
     * @param {EntityMetadata<T>} entityMetadata The metadata of the entity associated with the sort.
     * @param {Sort} [orderBy] The `Sort` instance to be made unique.
     * @returns {Sort} A `Sort` instance representing the unique sort criteria.
     */
    Sort.createUniqueSort = function (entityMetadata, orderBy) {
        var e_3, _a;
        if ((!orderBy || Object.keys(orderBy).length === 0) &&
            entityMetadata.options.defaultOrderBy)
            orderBy = Sort.translateOrderByToSort(entityMetadata, entityMetadata.options.defaultOrderBy);
        if (!orderBy)
            orderBy = new Sort();
        var _loop_2 = function (field) {
            if (!orderBy.Segments.find(function (x) { return x.field == field; })) {
                orderBy.Segments.push({ field: field });
            }
        };
        try {
            for (var _b = tslib_1.__values(entityMetadata.idMetadata.fields), _c = _b.next(); !_c.done; _c = _b.next()) {
                var field = _c.value;
                _loop_2(field);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return orderBy;
    };
    /**
     * Creates a unique `EntityOrderBy` based on the provided `EntityOrderBy` and the entity metadata.
     * This ensures that the order by criteria result in a unique ordering of entities.
     *
     * @template T The entity type for the order by.
     * @param {EntityMetadata<T>} entityMetadata The metadata of the entity associated with the order by.
     * @param {EntityOrderBy<T>} [orderBy] The `EntityOrderBy` to be made unique.
     * @returns {EntityOrderBy<T>} An `EntityOrderBy` representing the unique order by criteria.
     */
    Sort.createUniqueEntityOrderBy = function (entityMetadata, orderBy) {
        var e_4, _a;
        if (!orderBy || Object.keys(orderBy).length === 0)
            orderBy = entityMetadata.options.defaultOrderBy;
        if (!orderBy)
            orderBy = {};
        else
            orderBy = tslib_1.__assign({}, orderBy);
        try {
            for (var _b = tslib_1.__values(entityMetadata.idMetadata.fields), _c = _b.next(); !_c.done; _c = _b.next()) {
                var field = _c.value;
                if (!orderBy[field.key]) {
                    orderBy[field.key] = 'asc';
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return orderBy;
    };
    return Sort;
}());
exports.Sort = Sort;
function compareForSort(left, right, descending) {
    left = fixValueForSort(left);
    right = fixValueForSort(right);
    var r = 0;
    if (left > right)
        r = 1;
    else if (left < right)
        r = -1;
    if (descending)
        r *= -1;
    return r;
}
function fixValueForSort(a) {
    if (a == undefined || a == null)
        return a;
    if (a.id !== undefined)
        return a.id;
    return a;
}
