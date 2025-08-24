"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelationLoader = void 0;
var tslib_1 = require("tslib");
var rest_data_provider_js_1 = require("../data-providers/rest-data-provider.js");
var getEntityRef_js_1 = require("./getEntityRef.js");
var relationInfoMember_js_1 = require("./relationInfoMember.js");
var RelationLoader = /** @class */ (function () {
    function RelationLoader() {
        this.entityLoaders = new Map();
        this.promises = [];
    }
    RelationLoader.prototype.load = function (rel, findOptions) {
        var e = this.entityLoaders.get(rel.entityType);
        if (!e) {
            this.entityLoaders.set(rel.entityType, (e = new EntityLoader(rel)));
        }
        var p = e.find(findOptions);
        this.promises.push(p);
        return p;
    };
    RelationLoader.prototype.resolveAll = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, _b, entity, _c, _d, variation, x;
            var e_1, _e, e_2, _f;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        try {
                            for (_a = tslib_1.__values(this.entityLoaders.values()), _b = _a.next(); !_b.done; _b = _a.next()) {
                                entity = _b.value;
                                try {
                                    for (_c = (e_2 = void 0, tslib_1.__values(entity.queries.values())), _d = _c.next(); !_d.done; _d = _c.next()) {
                                        variation = _d.value;
                                        variation.resolve();
                                    }
                                }
                                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                                finally {
                                    try {
                                        if (_d && !_d.done && (_f = _c.return)) _f.call(_c);
                                    }
                                    finally { if (e_2) throw e_2.error; }
                                }
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (_b && !_b.done && (_e = _a.return)) _e.call(_a);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        if (this.promises.length === 0)
                            return [2 /*return*/];
                        x = this.promises;
                        this.promises = [];
                        return [4 /*yield*/, Promise.all(x)];
                    case 1:
                        _g.sent();
                        return [4 /*yield*/, this.resolveAll()];
                    case 2:
                        _g.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return RelationLoader;
}());
exports.RelationLoader = RelationLoader;
var EntityLoader = /** @class */ (function () {
    function EntityLoader(rel) {
        this.rel = rel;
        this.queries = new Map();
    }
    EntityLoader.prototype.find = function (findOptions) {
        var _a = (0, rest_data_provider_js_1.findOptionsToJson)(findOptions, this.rel.metadata), where = _a.where, options = tslib_1.__rest(_a, ["where"]);
        var optionKeys = JSON.stringify(options);
        var q = this.queries.get(optionKeys);
        if (!q) {
            this.queries.set(optionKeys, (q = new QueryVariation(this.rel)));
        }
        return q.find(findOptions, where);
    };
    return EntityLoader;
}());
var QueryVariation = /** @class */ (function () {
    function QueryVariation(rel) {
        this.rel = rel;
        this.pendingInStatements = new Map();
        this.whereVariations = new Map();
    }
    QueryVariation.prototype.find = function (findOptions, where) {
        var whereKey = JSON.stringify(where);
        var w = this.whereVariations.get(whereKey);
        if (!w) {
            var keys = Object.keys(where);
            if (keys.length === 1 &&
                typeof where[keys[0]] !== 'object' &&
                !findOptions.limit // because merging calls in that case may bring non more rows than the limit
            ) {
                var inVariation = this.pendingInStatements.get(keys[0]);
                if (!inVariation) {
                    this.pendingInStatements.set(keys[0], (inVariation = new PendingInStatements(this.rel, keys[0], findOptions)));
                }
                this.whereVariations.set(whereKey, (w = {
                    result: inVariation.find(where),
                }));
            }
            else {
                this.whereVariations.set(whereKey, (w = {
                    result: this.rel.find(findOptions),
                }));
            }
        }
        return w.result;
    };
    QueryVariation.prototype.resolve = function () {
        var e_3, _a;
        var statements = tslib_1.__spreadArray([], tslib_1.__read(this.pendingInStatements.values()), false);
        this.pendingInStatements.clear();
        try {
            for (var statements_1 = tslib_1.__values(statements), statements_1_1 = statements_1.next(); !statements_1_1.done; statements_1_1 = statements_1.next()) {
                var statement = statements_1_1.value;
                statement.resolve();
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (statements_1_1 && !statements_1_1.done && (_a = statements_1.return)) _a.call(statements_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
    };
    return QueryVariation;
}());
var PendingInStatements = /** @class */ (function () {
    function PendingInStatements(rel, key, options) {
        this.rel = rel;
        this.key = key;
        this.options = options;
        this.values = new Map();
    }
    PendingInStatements.prototype.resolve = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var values, op, vals, val, _loop_1, _a, _b, value, err_1, _c, _d, value;
            var _e, e_4, _f, e_5, _g;
            var _this = this;
            return tslib_1.__generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        values = tslib_1.__spreadArray([], tslib_1.__read(this.values.values()), false);
                        if (values.length == 1) {
                            this.rel.find(this.options).then(values[0].resolve, values[0].reject);
                            return [2 /*return*/];
                        }
                        op = tslib_1.__assign({}, this.options);
                        op.where = (_e = {}, _e[this.key] = values.map(function (v) { return v.value; }), _e);
                        op.limit = 1000;
                        op.page = 1;
                        vals = [];
                        _h.label = 1;
                    case 1:
                        _h.trys.push([1, 5, , 6]);
                        _h.label = 2;
                    case 2:
                        if (!true) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.rel.find(op)];
                    case 3:
                        val = _h.sent();
                        vals.push.apply(vals, tslib_1.__spreadArray([], tslib_1.__read(val), false));
                        if (val.length < op.limit)
                            return [3 /*break*/, 4];
                        op.page++;
                        return [3 /*break*/, 2];
                    case 4:
                        _loop_1 = function (value) {
                            value.resolve(vals.filter(function (x) {
                                var ref = (0, getEntityRef_js_1.getEntityRef)(x);
                                var field = ref.fields.find(_this.key);
                                var rel = (0, relationInfoMember_js_1.getRelationFieldInfo)(field.metadata);
                                var val = (rel === null || rel === void 0 ? void 0 : rel.type) === 'reference'
                                    ? field.getId()
                                    : x[_this.key];
                                return value.value == val;
                            }));
                        };
                        try {
                            for (_a = tslib_1.__values(this.values.values()), _b = _a.next(); !_b.done; _b = _a.next()) {
                                value = _b.value;
                                _loop_1(value);
                            }
                        }
                        catch (e_4_1) { e_4 = { error: e_4_1 }; }
                        finally {
                            try {
                                if (_b && !_b.done && (_f = _a.return)) _f.call(_a);
                            }
                            finally { if (e_4) throw e_4.error; }
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        err_1 = _h.sent();
                        try {
                            for (_c = tslib_1.__values(this.values.values()), _d = _c.next(); !_d.done; _d = _c.next()) {
                                value = _d.value;
                                value.reject(err_1);
                            }
                        }
                        catch (e_5_1) { e_5 = { error: e_5_1 }; }
                        finally {
                            try {
                                if (_d && !_d.done && (_g = _c.return)) _g.call(_c);
                            }
                            finally { if (e_5) throw e_5.error; }
                        }
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    PendingInStatements.prototype.find = function (where) {
        var val = where[this.key];
        var valHandler = this.values.get(val);
        if (!valHandler) {
            var resolve_1;
            var reject_1;
            var result = new Promise(function (resolve1, reject1) {
                resolve_1 = resolve1;
                reject_1 = reject1;
            });
            this.values.set(val, (valHandler = {
                value: val,
                resolve: resolve_1,
                reject: reject_1,
                result: result,
            }));
        }
        return valHandler.result;
    };
    return PendingInStatements;
}());
