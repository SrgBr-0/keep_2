"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayEntityDataProvider = void 0;
var tslib_1 = require("tslib");
var CompoundIdField_js_1 = require("../CompoundIdField.js");
var filter_consumer_bridge_to_sql_request_js_1 = require("../filter/filter-consumer-bridge-to-sql-request.js");
var filter_interfaces_js_1 = require("../filter/filter-interfaces.js");
var remult3_js_1 = require("../remult3/remult3.js");
var sort_js_1 = require("../sort.js");
var ArrayEntityDataProvider = /** @class */ (function () {
    function ArrayEntityDataProvider(entity, rows) {
        this.entity = entity;
        this.rows = rows;
    }
    ArrayEntityDataProvider.rawFilter = function (filter) {
        var _a;
        return _a = {},
            _a[filter_interfaces_js_1.customDatabaseFilterToken] = {
                arrayFilter: filter,
            },
            _a;
    };
    ArrayEntityDataProvider.prototype.groupBy = function (options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            function finishGroup() {
                var e_8, _a;
                var r = tslib_1.__assign(tslib_1.__assign({}, group), { $count: count });
                try {
                    for (var aggregates_2 = tslib_1.__values(aggregates), aggregates_2_1 = aggregates_2.next(); !aggregates_2_1.done; aggregates_2_1 = aggregates_2.next()) {
                        var a = aggregates_2_1.value;
                        a.finishGroup(r);
                    }
                }
                catch (e_8_1) { e_8 = { error: e_8_1 }; }
                finally {
                    try {
                        if (aggregates_2_1 && !aggregates_2_1.done && (_a = aggregates_2.return)) _a.call(aggregates_2);
                    }
                    finally { if (e_8) throw e_8.error; }
                }
                r[remult3_js_1.GroupByCountMember] = count;
                result.push(r);
                first = true;
                count = 0;
            }
            var sort, _a, _b, field, rows, result, group, first, count, aggregates, operatorImpl, GroupByOperators_1, GroupByOperators_1_1, operator, _c, _d, element, rows_1, rows_1_1, row, _e, _f, field, _g, _h, field, aggregates_1, aggregates_1_1, a;
            var e_1, _j, e_2, _k, e_3, _l, e_4, _m, e_5, _o, e_6, _p, e_7, _q;
            return tslib_1.__generator(this, function (_r) {
                switch (_r.label) {
                    case 0:
                        sort = new sort_js_1.Sort();
                        if (options === null || options === void 0 ? void 0 : options.group)
                            try {
                                for (_a = tslib_1.__values(options === null || options === void 0 ? void 0 : options.group), _b = _a.next(); !_b.done; _b = _a.next()) {
                                    field = _b.value;
                                    sort.Segments.push({ field: field });
                                }
                            }
                            catch (e_1_1) { e_1 = { error: e_1_1 }; }
                            finally {
                                try {
                                    if (_b && !_b.done && (_j = _a.return)) _j.call(_a);
                                }
                                finally { if (e_1) throw e_1.error; }
                            }
                        return [4 /*yield*/, this.find({ orderBy: sort, where: options === null || options === void 0 ? void 0 : options.where })];
                    case 1:
                        rows = _r.sent();
                        result = [];
                        group = {};
                        first = true;
                        count = 0;
                        aggregates = [];
                        operatorImpl = {
                            sum: function (key) {
                                var sum = 0;
                                return {
                                    process: function (row) {
                                        var val = row[key];
                                        if (val !== undefined && val !== null)
                                            sum += row[key];
                                    },
                                    finishGroup: function (result) {
                                        result[key] = tslib_1.__assign(tslib_1.__assign({}, result[key]), { sum: sum });
                                        sum = 0;
                                    },
                                };
                            },
                            avg: function (key) {
                                var sum = 0;
                                var count = 0;
                                return {
                                    process: function (row) {
                                        var val = row[key];
                                        if (val !== undefined && val !== null) {
                                            sum += row[key];
                                            count++;
                                        }
                                    },
                                    finishGroup: function (result) {
                                        result[key] = tslib_1.__assign(tslib_1.__assign({}, result[key]), { avg: sum / count });
                                        sum = 0;
                                        count = 0;
                                    },
                                };
                            },
                            min: function (key) {
                                var min = undefined;
                                return {
                                    process: function (row) {
                                        var val = row[key];
                                        if (val !== undefined && val !== null) {
                                            if (min === undefined || val < min)
                                                min = val;
                                        }
                                    },
                                    finishGroup: function (result) {
                                        result[key] = tslib_1.__assign(tslib_1.__assign({}, result[key]), { min: min });
                                        min = undefined;
                                    },
                                };
                            },
                            max: function (key) {
                                var max = undefined;
                                return {
                                    process: function (row) {
                                        var val = row[key];
                                        if (val !== undefined && val !== null) {
                                            if (max === undefined || val > max)
                                                max = val;
                                        }
                                    },
                                    finishGroup: function (result) {
                                        result[key] = tslib_1.__assign(tslib_1.__assign({}, result[key]), { max: max });
                                        max = undefined;
                                    },
                                };
                            },
                            distinctCount: function (key) {
                                var distinct = new Set();
                                return {
                                    process: function (row) {
                                        var val = row[key];
                                        if (val !== undefined && val !== null)
                                            distinct.add(val);
                                    },
                                    finishGroup: function (result) {
                                        result[key] = tslib_1.__assign(tslib_1.__assign({}, result[key]), { distinctCount: distinct.size });
                                        distinct.clear();
                                    },
                                };
                            },
                        };
                        try {
                            for (GroupByOperators_1 = tslib_1.__values(remult3_js_1.GroupByOperators), GroupByOperators_1_1 = GroupByOperators_1.next(); !GroupByOperators_1_1.done; GroupByOperators_1_1 = GroupByOperators_1.next()) {
                                operator = GroupByOperators_1_1.value;
                                if (options === null || options === void 0 ? void 0 : options[operator]) {
                                    try {
                                        for (_c = (e_3 = void 0, tslib_1.__values(options[operator])), _d = _c.next(); !_d.done; _d = _c.next()) {
                                            element = _d.value;
                                            aggregates.push(operatorImpl[operator](element.key));
                                        }
                                    }
                                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                                    finally {
                                        try {
                                            if (_d && !_d.done && (_l = _c.return)) _l.call(_c);
                                        }
                                        finally { if (e_3) throw e_3.error; }
                                    }
                                }
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (GroupByOperators_1_1 && !GroupByOperators_1_1.done && (_k = GroupByOperators_1.return)) _k.call(GroupByOperators_1);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        try {
                            for (rows_1 = tslib_1.__values(rows), rows_1_1 = rows_1.next(); !rows_1_1.done; rows_1_1 = rows_1.next()) {
                                row = rows_1_1.value;
                                if (options === null || options === void 0 ? void 0 : options.group) {
                                    if (!first) {
                                        try {
                                            for (_e = (e_5 = void 0, tslib_1.__values(options === null || options === void 0 ? void 0 : options.group)), _f = _e.next(); !_f.done; _f = _e.next()) {
                                                field = _f.value;
                                                if (group[field.key] != row[field.key]) {
                                                    finishGroup();
                                                    break;
                                                }
                                            }
                                        }
                                        catch (e_5_1) { e_5 = { error: e_5_1 }; }
                                        finally {
                                            try {
                                                if (_f && !_f.done && (_o = _e.return)) _o.call(_e);
                                            }
                                            finally { if (e_5) throw e_5.error; }
                                        }
                                    }
                                    if (first) {
                                        try {
                                            for (_g = (e_6 = void 0, tslib_1.__values(options === null || options === void 0 ? void 0 : options.group)), _h = _g.next(); !_h.done; _h = _g.next()) {
                                                field = _h.value;
                                                group[field.key] = row[field.key];
                                            }
                                        }
                                        catch (e_6_1) { e_6 = { error: e_6_1 }; }
                                        finally {
                                            try {
                                                if (_h && !_h.done && (_p = _g.return)) _p.call(_g);
                                            }
                                            finally { if (e_6) throw e_6.error; }
                                        }
                                    }
                                }
                                try {
                                    for (aggregates_1 = (e_7 = void 0, tslib_1.__values(aggregates)), aggregates_1_1 = aggregates_1.next(); !aggregates_1_1.done; aggregates_1_1 = aggregates_1.next()) {
                                        a = aggregates_1_1.value;
                                        a.process(row);
                                    }
                                }
                                catch (e_7_1) { e_7 = { error: e_7_1 }; }
                                finally {
                                    try {
                                        if (aggregates_1_1 && !aggregates_1_1.done && (_q = aggregates_1.return)) _q.call(aggregates_1);
                                    }
                                    finally { if (e_7) throw e_7.error; }
                                }
                                count++;
                                first = false;
                            }
                        }
                        catch (e_4_1) { e_4 = { error: e_4_1 }; }
                        finally {
                            try {
                                if (rows_1_1 && !rows_1_1.done && (_m = rows_1.return)) _m.call(rows_1);
                            }
                            finally { if (e_4) throw e_4.error; }
                        }
                        finishGroup();
                        if (options === null || options === void 0 ? void 0 : options.orderBy) {
                            result.sort(function (a, b) {
                                var e_9, _a;
                                var _loop_1 = function (x) {
                                    var getValue_1 = function (row) {
                                        if (!x.field && x.operation == 'count') {
                                            return row[remult3_js_1.GroupByCountMember];
                                        }
                                        else {
                                            switch (x.operation) {
                                                case 'count':
                                                    return row[remult3_js_1.GroupByCountMember];
                                                case undefined:
                                                    return row[x.field.key];
                                                default:
                                                    return row[x.field.key][x.operation];
                                            }
                                        }
                                    };
                                    var compare = (0, sort_js_1.compareForSort)(getValue_1(a), getValue_1(b), x.isDescending);
                                    if (compare != 0)
                                        return { value: compare };
                                };
                                try {
                                    for (var _b = tslib_1.__values(options.orderBy), _c = _b.next(); !_c.done; _c = _b.next()) {
                                        var x = _c.value;
                                        var state_1 = _loop_1(x);
                                        if (typeof state_1 === "object")
                                            return state_1.value;
                                    }
                                }
                                catch (e_9_1) { e_9 = { error: e_9_1 }; }
                                finally {
                                    try {
                                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                                    }
                                    finally { if (e_9) throw e_9.error; }
                                }
                                return 0;
                            });
                        }
                        return [2 /*return*/, pageArray(result, { page: options === null || options === void 0 ? void 0 : options.page, limit: options === null || options === void 0 ? void 0 : options.limit })];
                }
            });
        });
    };
    //@internal
    ArrayEntityDataProvider.prototype.init = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, r;
            var e_10, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (this.__names)
                            return [2 /*return*/, this.__names];
                        _a = this;
                        return [4 /*yield*/, (0, filter_consumer_bridge_to_sql_request_js_1.dbNamesOf)(this.entity, function (x) { return x; })];
                    case 1:
                        _a.__names = _e.sent();
                        try {
                            for (_b = tslib_1.__values(this.rows()), _c = _b.next(); !_c.done; _c = _b.next()) {
                                r = _c.value;
                                this.verifyThatRowHasAllNotNullColumns(r, this.__names);
                            }
                        }
                        catch (e_10_1) { e_10 = { error: e_10_1 }; }
                        finally {
                            try {
                                if (_c && !_c.done && (_d = _b.return)) _d.call(_b);
                            }
                            finally { if (e_10) throw e_10.error; }
                        }
                        return [2 /*return*/, this.__names];
                }
            });
        });
    };
    //@internal
    ArrayEntityDataProvider.prototype.verifyThatRowHasAllNotNullColumns = function (r, names) {
        var e_11, _a;
        try {
            for (var _b = tslib_1.__values(this.entity.fields), _c = _b.next(); !_c.done; _c = _b.next()) {
                var f = _c.value;
                var key = names.$dbNameOf(f);
                if (!f.isServerExpression)
                    if (!f.allowNull) {
                        if (r[key] === undefined || r[key] === null) {
                            var val = undefined;
                            if (f.valueType === Boolean)
                                val = false;
                            else if (f.valueType === Number)
                                val = 0;
                            else if (f.valueType === String)
                                val = '';
                            r[key] = val;
                        }
                    }
                    else if (r[key] === undefined)
                        r[key] = null;
            }
        }
        catch (e_11_1) { e_11 = { error: e_11_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_11) throw e_11.error; }
        }
    };
    ArrayEntityDataProvider.prototype.count = function (where) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var rows, names, j, i, x;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rows = this.rows();
                        return [4 /*yield*/, this.init()];
                    case 1:
                        names = _a.sent();
                        j = 0;
                        for (i = 0; i < rows.length; i++) {
                            if (!where) {
                                j++;
                            }
                            else {
                                x = new FilterConsumerBridgeToObject(rows[i], names);
                                where.__applyToConsumer(x);
                                if (x.ok)
                                    j++;
                            }
                        }
                        return [2 /*return*/, j];
                }
            });
        });
    };
    ArrayEntityDataProvider.prototype.find = function (options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var rows, dbNames;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rows = this.rows();
                        return [4 /*yield*/, this.init()];
                    case 1:
                        dbNames = _a.sent();
                        if (options) {
                            if (options.where) {
                                rows = rows.filter(function (i) {
                                    var x = new FilterConsumerBridgeToObject(i, dbNames);
                                    options.where.__applyToConsumer(x);
                                    return x.ok;
                                });
                            }
                            if (options.orderBy) {
                                rows = rows.sort(function (a, b) {
                                    return options.orderBy.compare(a, b, dbNames.$dbNameOf);
                                });
                            }
                            rows = pageArray(rows, options);
                        }
                        if (rows)
                            return [2 /*return*/, rows.map(function (i) {
                                    return _this.translateFromJson(i, dbNames);
                                })];
                        return [2 /*return*/, []];
                }
            });
        });
    };
    //@internal
    ArrayEntityDataProvider.prototype.translateFromJson = function (row, dbNames) {
        var e_12, _a;
        var result = {};
        try {
            for (var _b = tslib_1.__values(this.entity.fields), _c = _b.next(); !_c.done; _c = _b.next()) {
                var col = _c.value;
                result[col.key] = col.valueConverter.fromJson(row[dbNames.$dbNameOf(col)]);
            }
        }
        catch (e_12_1) { e_12 = { error: e_12_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_12) throw e_12.error; }
        }
        return result;
    };
    //@internal
    ArrayEntityDataProvider.prototype.translateToJson = function (row, dbNames) {
        var e_13, _a;
        var result = {};
        try {
            for (var _b = tslib_1.__values(this.entity.fields), _c = _b.next(); !_c.done; _c = _b.next()) {
                var col = _c.value;
                if (!(0, filter_consumer_bridge_to_sql_request_js_1.isDbReadonly)(col, dbNames))
                    result[dbNames.$dbNameOf(col)] = col.valueConverter.toJson(row[col.key]);
            }
        }
        catch (e_13_1) { e_13 = { error: e_13_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_13) throw e_13.error; }
        }
        return result;
    };
    //@internal
    ArrayEntityDataProvider.prototype.idMatches = function (id, names) {
        var _this = this;
        return function (item) {
            var x = new FilterConsumerBridgeToObject(item, names);
            filter_interfaces_js_1.Filter.fromEntityFilter(_this.entity, _this.entity.idMetadata.getIdFilter(id)).__applyToConsumer(x);
            return x.ok;
        };
    };
    ArrayEntityDataProvider.prototype.update = function (id, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var names, idMatches, keys, _loop_2, this_1, i, state_2;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.init()];
                    case 1:
                        names = _a.sent();
                        idMatches = this.idMatches(id, names);
                        keys = Object.keys(data);
                        _loop_2 = function (i) {
                            var e_14, _b;
                            var r = this_1.rows()[i];
                            if (idMatches(r)) {
                                var newR_1 = tslib_1.__assign({}, r);
                                try {
                                    for (var _c = (e_14 = void 0, tslib_1.__values(this_1.entity.fields)), _d = _c.next(); !_d.done; _d = _c.next()) {
                                        var f = _d.value;
                                        if (!(0, filter_consumer_bridge_to_sql_request_js_1.isDbReadonly)(f, names)) {
                                            if (keys.includes(f.key)) {
                                                newR_1[names.$dbNameOf(f)] = f.valueConverter.toJson(data[f.key]);
                                            }
                                        }
                                    }
                                }
                                catch (e_14_1) { e_14 = { error: e_14_1 }; }
                                finally {
                                    try {
                                        if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                                    }
                                    finally { if (e_14) throw e_14.error; }
                                }
                                if (this_1.entity.idMetadata.fields.find(function (x) { return newR_1[names.$dbNameOf(x)] != r[names.$dbNameOf(x)]; }) &&
                                    this_1.rows().find(function (x) {
                                        var e_15, _a;
                                        try {
                                            for (var _b = (e_15 = void 0, tslib_1.__values(_this.entity.idMetadata.fields)), _c = _b.next(); !_c.done; _c = _b.next()) {
                                                var f = _c.value;
                                                if (x[names.$dbNameOf(f)] != newR_1[names.$dbNameOf(f)])
                                                    return false;
                                            }
                                        }
                                        catch (e_15_1) { e_15 = { error: e_15_1 }; }
                                        finally {
                                            try {
                                                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                                            }
                                            finally { if (e_15) throw e_15.error; }
                                        }
                                        return true;
                                    })) {
                                    throw Error('id already exists');
                                }
                                this_1.verifyThatRowHasAllNotNullColumns(newR_1, names);
                                this_1.rows()[i] = newR_1;
                                return { value: Promise.resolve(this_1.translateFromJson(this_1.rows()[i], names)) };
                            }
                        };
                        this_1 = this;
                        for (i = 0; i < this.rows().length; i++) {
                            state_2 = _loop_2(i);
                            if (typeof state_2 === "object")
                                return [2 /*return*/, state_2.value];
                        }
                        throw new Error("ArrayEntityDataProvider: Couldn't find row with id \"".concat(id, "\" in entity \"").concat(this.entity.key, "\" to update"));
                }
            });
        });
    };
    ArrayEntityDataProvider.prototype.delete = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var names, idMatches, i;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.init()];
                    case 1:
                        names = _a.sent();
                        idMatches = this.idMatches(id, names);
                        for (i = 0; i < this.rows().length; i++) {
                            if (idMatches(this.rows()[i])) {
                                this.rows().splice(i, 1);
                                return [2 /*return*/, Promise.resolve()];
                            }
                        }
                        throw new Error("ArrayEntityDataProvider: Couldn't find row with id \"".concat(id, "\" in entity \"").concat(this.entity.key, "\" to delete"));
                }
            });
        });
    };
    ArrayEntityDataProvider.prototype.insert = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var names, j, idf, _a, _b, row;
            var e_16, _c;
            var _this = this;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.init()];
                    case 1:
                        names = _d.sent();
                        j = this.translateToJson(data, names);
                        idf = this.entity.idMetadata.field;
                        if (!(idf instanceof CompoundIdField_js_1.CompoundIdField) &&
                            idf.valueConverter.fieldTypeInDb === 'autoincrement') {
                            j[idf.key] = 1;
                            try {
                                for (_a = tslib_1.__values(this.rows()), _b = _a.next(); !_b.done; _b = _a.next()) {
                                    row = _b.value;
                                    if (row[idf.key] >= j[idf.key])
                                        j[idf.key] = row[idf.key] + 1;
                                }
                            }
                            catch (e_16_1) { e_16 = { error: e_16_1 }; }
                            finally {
                                try {
                                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                                }
                                finally { if (e_16) throw e_16.error; }
                            }
                        }
                        else {
                            if (this.rows().find(function (x) {
                                var e_17, _a;
                                try {
                                    for (var _b = tslib_1.__values(_this.entity.idMetadata.fields), _c = _b.next(); !_c.done; _c = _b.next()) {
                                        var f = _c.value;
                                        if (x[names.$dbNameOf(f)] != j[names.$dbNameOf(f)])
                                            return false;
                                    }
                                }
                                catch (e_17_1) { e_17 = { error: e_17_1 }; }
                                finally {
                                    try {
                                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                                    }
                                    finally { if (e_17) throw e_17.error; }
                                }
                                return true;
                            })) {
                                throw Error('id already exists');
                            }
                        }
                        this.verifyThatRowHasAllNotNullColumns(j, names);
                        this.rows().push(j);
                        return [2 /*return*/, Promise.resolve(this.translateFromJson(j, names))];
                }
            });
        });
    };
    return ArrayEntityDataProvider;
}());
exports.ArrayEntityDataProvider = ArrayEntityDataProvider;
function pageArray(rows, options) {
    if (!options)
        return rows;
    if (!options.limit)
        return rows;
    var page = 1;
    if (options.page)
        page = options.page;
    if (page < 1)
        page = 1;
    var x = 0;
    return rows.filter(function (i) {
        x++;
        var max = page * options.limit;
        var min = max - options.limit;
        return x > min && x <= max;
    });
}
var FilterConsumerBridgeToObject = /** @class */ (function () {
    function FilterConsumerBridgeToObject(row, dbNames) {
        this.row = row;
        this.dbNames = dbNames;
        this.ok = true;
    }
    FilterConsumerBridgeToObject.prototype.databaseCustom = function (databaseCustom) {
        if (databaseCustom && databaseCustom.arrayFilter) {
            if (!databaseCustom.arrayFilter(this.row))
                this.ok = false;
        }
    };
    FilterConsumerBridgeToObject.prototype.custom = function (key, customItem) {
        throw new Error('Custom Filter should be translated before it gets here');
    };
    FilterConsumerBridgeToObject.prototype.or = function (orElements) {
        var e_18, _a;
        try {
            for (var orElements_1 = tslib_1.__values(orElements), orElements_1_1 = orElements_1.next(); !orElements_1_1.done; orElements_1_1 = orElements_1.next()) {
                var element = orElements_1_1.value;
                var filter = new FilterConsumerBridgeToObject(this.row, this.dbNames);
                element.__applyToConsumer(filter);
                if (filter.ok) {
                    return;
                }
            }
        }
        catch (e_18_1) { e_18 = { error: e_18_1 }; }
        finally {
            try {
                if (orElements_1_1 && !orElements_1_1.done && (_a = orElements_1.return)) _a.call(orElements_1);
            }
            finally { if (e_18) throw e_18.error; }
        }
        this.ok = false;
    };
    FilterConsumerBridgeToObject.prototype.not = function (element) {
        var filter = new FilterConsumerBridgeToObject(this.row, this.dbNames);
        element.__applyToConsumer(filter);
        if (filter.ok)
            this.ok = false;
    };
    FilterConsumerBridgeToObject.prototype.isNull = function (col) {
        if (this.row[this.dbNames.$dbNameOf(col)] != null)
            this.ok = false;
    };
    FilterConsumerBridgeToObject.prototype.isNotNull = function (col) {
        if (this.row[this.dbNames.$dbNameOf(col)] == null)
            this.ok = false;
    };
    FilterConsumerBridgeToObject.prototype.isIn = function (col, val) {
        var e_19, _a;
        try {
            for (var val_1 = tslib_1.__values(val), val_1_1 = val_1.next(); !val_1_1.done; val_1_1 = val_1.next()) {
                var v = val_1_1.value;
                if (this.row[this.dbNames.$dbNameOf(col)] == col.valueConverter.toJson(v)) {
                    return;
                }
            }
        }
        catch (e_19_1) { e_19 = { error: e_19_1 }; }
        finally {
            try {
                if (val_1_1 && !val_1_1.done && (_a = val_1.return)) _a.call(val_1);
            }
            finally { if (e_19) throw e_19.error; }
        }
        this.ok = false;
    };
    FilterConsumerBridgeToObject.prototype.isEqualTo = function (col, val) {
        if (this.row[this.dbNames.$dbNameOf(col)] != col.valueConverter.toJson(val))
            this.ok = false;
    };
    FilterConsumerBridgeToObject.prototype.isDifferentFrom = function (col, val) {
        if (this.row[this.dbNames.$dbNameOf(col)] == col.valueConverter.toJson(val))
            this.ok = false;
    };
    FilterConsumerBridgeToObject.prototype.isGreaterOrEqualTo = function (col, val) {
        if (this.row[this.dbNames.$dbNameOf(col)] < col.valueConverter.toJson(val))
            this.ok = false;
    };
    FilterConsumerBridgeToObject.prototype.isGreaterThan = function (col, val) {
        if (this.row[this.dbNames.$dbNameOf(col)] <= col.valueConverter.toJson(val))
            this.ok = false;
    };
    FilterConsumerBridgeToObject.prototype.isLessOrEqualTo = function (col, val) {
        if (this.row[this.dbNames.$dbNameOf(col)] > col.valueConverter.toJson(val))
            this.ok = false;
    };
    FilterConsumerBridgeToObject.prototype.isLessThan = function (col, val) {
        if (this.row[this.dbNames.$dbNameOf(col)] >= col.valueConverter.toJson(val))
            this.ok = false;
    };
    FilterConsumerBridgeToObject.prototype.containsCaseInsensitive = function (col, val) {
        var v = this.row[this.dbNames.$dbNameOf(col)];
        if (!v) {
            this.ok = false;
            return;
        }
        var s = '' + v;
        if (val)
            val = col.valueConverter.toJson(val);
        if (val)
            val = val.toString().toLowerCase();
        if (s.toLowerCase().indexOf(val) < 0)
            this.ok = false;
    };
    FilterConsumerBridgeToObject.prototype.notContainsCaseInsensitive = function (col, val) {
        var v = this.row[this.dbNames.$dbNameOf(col)];
        if (!v) {
            this.ok = false;
            return;
        }
        var s = '' + v;
        if (val)
            val = col.valueConverter.toJson(val);
        if (val)
            val = val.toString().toLowerCase();
        if (s.toLowerCase().indexOf(val) >= 0)
            this.ok = false;
    };
    FilterConsumerBridgeToObject.prototype.startsWithCaseInsensitive = function (col, val) {
        var v = this.row[this.dbNames.$dbNameOf(col)];
        if (!v) {
            this.ok = false;
            return;
        }
        var s = '' + v;
        if (val)
            val = col.valueConverter.toJson(val);
        if (val)
            val = val.toString().toLowerCase();
        if (!s.toLowerCase().startsWith(val))
            this.ok = false;
    };
    FilterConsumerBridgeToObject.prototype.endsWithCaseInsensitive = function (col, val) {
        var v = this.row[this.dbNames.$dbNameOf(col)];
        if (!v) {
            this.ok = false;
            return;
        }
        var s = '' + v;
        if (val)
            val = col.valueConverter.toJson(val);
        if (val)
            val = val.toString().toLowerCase();
        if (!s.toLowerCase().endsWith(val))
            this.ok = false;
    };
    return FilterConsumerBridgeToObject;
}());
