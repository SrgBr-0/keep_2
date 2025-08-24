"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlRelationFilter = void 0;
exports.sqlRelations = sqlRelations;
exports.sqlRelationsFilter = sqlRelationsFilter;
var tslib_1 = require("tslib");
var filter_consumer_bridge_to_sql_request_js_1 = require("../filter/filter-consumer-bridge-to-sql-request.js");
var relationInfoMember_js_1 = require("../remult3/relationInfoMember.js");
var sql_database_js_1 = require("./sql-database.js");
var remult_proxy_js_1 = require("../remult-proxy.js");
function sqlRelations(forEntity) {
    return new Proxy({}, {
        get: function (target, relationField) {
            return new Proxy(new SqlRelationTools(forEntity, relationField), {
                get: function (target, prop) {
                    if (prop == '$count')
                        return target.$count;
                    if (prop == '$subQuery')
                        return target.$subQuery;
                    if (prop == '$relations')
                        return target.___relations();
                    if (prop == '$first')
                        return target.$first;
                    return target.$fields[prop];
                },
            });
        },
    });
}
var SqlRelationTools = /** @class */ (function () {
    function SqlRelationTools(myEntity, relationField) {
        var _this = this;
        this.myEntity = myEntity;
        this.relationField = relationField;
        this.$count = function (where) {
            return _this.$subQuery(function () { return 'count(*)'; }, { where: where });
        };
        this.$first = function (options) {
            return new Proxy(_this, {
                get: function (target, prop) {
                    if (prop == '$subQuery')
                        return function (what) {
                            return target.$subQuery(what, tslib_1.__assign(tslib_1.__assign({}, options), { first: true }));
                        };
                    if (prop == '$relations')
                        return _this.___relations(tslib_1.__assign(tslib_1.__assign({}, options), { first: true }));
                    return target.$subQuery(function (fieldNamesOfToEntity) {
                        return fieldNamesOfToEntity.$dbNameOf(prop);
                    }, tslib_1.__assign(tslib_1.__assign({}, options), { first: true }));
                },
            });
        };
        this.$fields = new Proxy(this, {
            get: function (target, field) {
                return target.$subQuery(function (fieldNamesOfToEntity) {
                    return fieldNamesOfToEntity.$dbNameOf(field);
                });
            },
        });
        this.$subQuery = function (what, options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var rel, relFields, filters, namesOfOtherTable, namesOfMyTable, key, otherTableFilter, result, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        rel = (0, relationInfoMember_js_1.getRelationFieldInfo)(remult_proxy_js_1.remult.repo(this.myEntity).fields.find(this.relationField));
                        if (!rel)
                            throw new Error("".concat(this.relationField, " is not a relation"));
                        relFields = rel.getFields();
                        filters = [];
                        return [4 /*yield*/, (0, filter_consumer_bridge_to_sql_request_js_1.dbNamesOf)(rel.toEntity, {
                                tableName: true,
                            })];
                    case 1:
                        namesOfOtherTable = _b.sent();
                        return [4 /*yield*/, (0, filter_consumer_bridge_to_sql_request_js_1.dbNamesOf)(this.myEntity, { tableName: true })];
                    case 2:
                        namesOfMyTable = _b.sent();
                        for (key in relFields.fields) {
                            if (Object.prototype.hasOwnProperty.call(relFields.fields, key)) {
                                filters.push("".concat(namesOfOtherTable.$dbNameOf(key), " = ").concat(namesOfMyTable.$dbNameOf(relFields.fields[key])));
                            }
                        }
                        return [4 /*yield*/, sql_database_js_1.SqlDatabase.filterToRaw(remult_proxy_js_1.remult.repo(rel.toEntity), 
                            // eslint-disable-next-line
                            options === null || options === void 0 ? void 0 : options.where, undefined, namesOfOtherTable)];
                    case 3:
                        otherTableFilter = _b.sent();
                        if (otherTableFilter)
                            filters.push(otherTableFilter);
                        _a = "\n( SELECT ".concat;
                        return [4 /*yield*/, what(namesOfOtherTable)];
                    case 4:
                        result = _a.apply("\n( SELECT ", [_b.sent(), " \n  FROM "]).concat(namesOfOtherTable, " \n  WHERE ").concat(filters.join(' and '));
                        if (options === null || options === void 0 ? void 0 : options.orderBy) {
                            result += "\n  ORDER BY ".concat(Object.keys(options.orderBy)
                                .map(function (key) {
                                return "".concat(namesOfOtherTable.$dbNameOf(key), " ").concat(options.orderBy[key]);
                            })
                                .join(', '));
                        }
                        if (options === null || options === void 0 ? void 0 : options.first) {
                            result += "\n  LIMIT 1";
                        }
                        return [2 /*return*/, (result +
                                "\n)")];
                }
            });
        }); };
    }
    SqlRelationTools.prototype.___relations = function (options) {
        var _this = this;
        return new Proxy(this, {
            get: function (target, field) {
                var rel1 = (0, relationInfoMember_js_1.getRelationFieldInfo)(remult_proxy_js_1.remult.repo(_this.myEntity).fields.find(_this.relationField));
                return new Proxy(_this, {
                    get: function (target, field1) {
                        return _this.$subQuery(function () {
                            return indent(sqlRelations(rel1.toEntity)[field][field1]);
                        }, options);
                    },
                });
            },
        });
    };
    return SqlRelationTools;
}());
function sqlRelationsFilter(forEntity) {
    return new Proxy({}, {
        get: function (target, relationField) {
            return new SqlRelationFilter(forEntity, relationField);
        },
    });
}
var SqlRelationFilter = /** @class */ (function () {
    function SqlRelationFilter(myEntity, relationField) {
        this._tools = new SqlRelationTools(myEntity, relationField);
    }
    SqlRelationFilter.prototype.some = function (where) {
        var _this = this;
        //many orms use some, every, none
        return sql_database_js_1.SqlDatabase.rawFilter(function (c) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = 'exists ';
                        return [4 /*yield*/, this._tools.$subQuery(function () { return '1'; }, {
                                where: where,
                                c: c,
                            })];
                    case 1: return [2 /*return*/, (_a +
                            (_b.sent()))];
                }
            });
        }); });
    };
    return SqlRelationFilter;
}());
exports.SqlRelationFilter = SqlRelationFilter;
function indent(s) {
    return s.then(function (s) {
        return s
            .split('\n')
            .map(function (x) { return '  ' + x; })
            .join('\n');
    });
}
