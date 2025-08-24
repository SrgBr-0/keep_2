"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomSqlFilterBuilder = exports.FilterConsumerBridgeToSqlRequest = void 0;
exports.isDbReadonly = isDbReadonly;
exports.shouldNotCreateField = shouldNotCreateField;
exports.shouldCreateEntity = shouldCreateEntity;
exports.dbNamesOf = dbNamesOf;
exports.dbNamesOfWithForceSqlExpression = dbNamesOfWithForceSqlExpression;
exports.entityDbName = entityDbName;
exports.fieldDbName = fieldDbName;
var tslib_1 = require("tslib");
var sql_database_js_1 = require("../data-providers/sql-database.js");
var remult_proxy_js_1 = require("../remult-proxy.js");
var RepositoryImplementation_js_1 = require("../remult3/RepositoryImplementation.js");
var relationInfoMember_js_1 = require("../remult3/relationInfoMember.js");
var FilterConsumerBridgeToSqlRequest = /** @class */ (function () {
    function FilterConsumerBridgeToSqlRequest(r, nameProvider) {
        this.r = r;
        this.nameProvider = nameProvider;
        this.where = '';
        this._addWhere = true;
        this.promises = [];
    }
    FilterConsumerBridgeToSqlRequest.prototype.resolveWhere = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var p, p_1, p_1_1, pr, e_1_1;
            var e_1, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.promises.length > 0)) return [3 /*break*/, 9];
                        p = this.promises;
                        this.promises = [];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, 7, 8]);
                        p_1 = (e_1 = void 0, tslib_1.__values(p)), p_1_1 = p_1.next();
                        _b.label = 2;
                    case 2:
                        if (!!p_1_1.done) return [3 /*break*/, 5];
                        pr = p_1_1.value;
                        return [4 /*yield*/, pr];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        p_1_1 = p_1.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (p_1_1 && !p_1_1.done && (_a = p_1.return)) _a.call(p_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 8: return [3 /*break*/, 0];
                    case 9: return [2 /*return*/, this.where];
                }
            });
        });
    };
    FilterConsumerBridgeToSqlRequest.prototype.custom = function (key, customItem) {
        throw new Error('Custom filter should be translated before it gets here');
    };
    FilterConsumerBridgeToSqlRequest.prototype.or = function (orElements) {
        var _this = this;
        var statement = '';
        this.promises.push((function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var orElements_1, orElements_1_1, element, f, where, e_2_1;
            var e_2, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, 6, 7]);
                        orElements_1 = tslib_1.__values(orElements), orElements_1_1 = orElements_1.next();
                        _b.label = 1;
                    case 1:
                        if (!!orElements_1_1.done) return [3 /*break*/, 4];
                        element = orElements_1_1.value;
                        f = new FilterConsumerBridgeToSqlRequest(this.r, this.nameProvider);
                        f._addWhere = false;
                        element.__applyToConsumer(f);
                        return [4 /*yield*/, f.resolveWhere()];
                    case 2:
                        where = _b.sent();
                        if (!where)
                            return [2 /*return*/]; //since if any member of or is empty, then the entire or is irrelevant
                        if (where.length > 0) {
                            if (statement.length > 0) {
                                statement += ' or ';
                            }
                            if (orElements.length > 1) {
                                statement += '(' + where + ')';
                            }
                            else
                                statement += where;
                        }
                        _b.label = 3;
                    case 3:
                        orElements_1_1 = orElements_1.next();
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        e_2_1 = _b.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 7];
                    case 6:
                        try {
                            if (orElements_1_1 && !orElements_1_1.done && (_a = orElements_1.return)) _a.call(orElements_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 7:
                        this.addToWhere('(' + statement + ')');
                        return [2 /*return*/];
                }
            });
        }); })());
    };
    FilterConsumerBridgeToSqlRequest.prototype.not = function (element) {
        var _this = this;
        this.promises.push((function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var f, where;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        f = new FilterConsumerBridgeToSqlRequest(this.r, this.nameProvider);
                        f._addWhere = false;
                        element.__applyToConsumer(f);
                        return [4 /*yield*/, f.resolveWhere()];
                    case 1:
                        where = _a.sent();
                        if (!where)
                            return [2 /*return*/]; //since if any member of or is empty, then the entire or is irrelevant
                        this.addToWhere('not (' + where + ')');
                        return [2 /*return*/];
                }
            });
        }); })());
    };
    FilterConsumerBridgeToSqlRequest.prototype.isNull = function (col) {
        var _this = this;
        this.promises.push((function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, this.addToWhere(this.nameProvider.$dbNameOf(col) + ' is null')];
        }); }); })());
    };
    FilterConsumerBridgeToSqlRequest.prototype.isNotNull = function (col) {
        var _this = this;
        this.promises.push((function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, this.addToWhere(this.nameProvider.$dbNameOf(col) + ' is not null')];
        }); }); })());
    };
    FilterConsumerBridgeToSqlRequest.prototype.isIn = function (col, val) {
        var _this = this;
        this.promises.push((function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                if (val && val.length > 0)
                    this.addToWhere(this.nameProvider.$dbNameOf(col) +
                        ' in (' +
                        val
                            .map(function (x) { return _this.r.param(col.valueConverter.toDb(x)); })
                            .join(',') +
                        ')');
                else
                    this.addToWhere('1 = 0 /*isIn with no values*/');
                return [2 /*return*/];
            });
        }); })());
    };
    FilterConsumerBridgeToSqlRequest.prototype.isEqualTo = function (col, val) {
        this.add(col, val, '=');
    };
    FilterConsumerBridgeToSqlRequest.prototype.isDifferentFrom = function (col, val) {
        this.add(col, val, '<>');
    };
    FilterConsumerBridgeToSqlRequest.prototype.isGreaterOrEqualTo = function (col, val) {
        this.add(col, val, '>=');
    };
    FilterConsumerBridgeToSqlRequest.prototype.isGreaterThan = function (col, val) {
        this.add(col, val, '>');
    };
    FilterConsumerBridgeToSqlRequest.prototype.isLessOrEqualTo = function (col, val) {
        this.add(col, val, '<=');
    };
    FilterConsumerBridgeToSqlRequest.prototype.isLessThan = function (col, val) {
        this.add(col, val, '<');
    };
    FilterConsumerBridgeToSqlRequest.prototype.containsCaseInsensitive = function (col, val) {
        var _this = this;
        this.promises.push((function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this.addToWhere('lower (' +
                    this.nameProvider.$dbNameOf(col) +
                    ") like lower ('%" +
                    val.replace(/'/g, "''") +
                    "%')");
                return [2 /*return*/];
            });
        }); })());
    };
    FilterConsumerBridgeToSqlRequest.prototype.notContainsCaseInsensitive = function (col, val) {
        var _this = this;
        this.promises.push((function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this.addToWhere('not lower (' +
                    this.nameProvider.$dbNameOf(col) +
                    ") like lower ('%" +
                    val.replace(/'/g, "''") +
                    "%')");
                return [2 /*return*/];
            });
        }); })());
    };
    FilterConsumerBridgeToSqlRequest.prototype.startsWithCaseInsensitive = function (col, val) {
        var _this = this;
        this.promises.push((function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this.addToWhere('lower (' +
                    this.nameProvider.$dbNameOf(col) +
                    ") like lower ('" +
                    val.replace(/'/g, "''") +
                    "%')");
                return [2 /*return*/];
            });
        }); })());
    };
    FilterConsumerBridgeToSqlRequest.prototype.endsWithCaseInsensitive = function (col, val) {
        var _this = this;
        this.promises.push((function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this.addToWhere('lower (' +
                    this.nameProvider.$dbNameOf(col) +
                    ") like lower ('%" +
                    val.replace(/'/g, "''") +
                    "')");
                return [2 /*return*/];
            });
        }); })());
    };
    FilterConsumerBridgeToSqlRequest.prototype.add = function (col, val, operator) {
        var _this = this;
        this.promises.push((function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var x;
            return tslib_1.__generator(this, function (_a) {
                x = this.nameProvider.$dbNameOf(col) +
                    ' ' +
                    operator +
                    ' ' +
                    this.r.param(col.valueConverter.toDb(val));
                this.addToWhere(x);
                return [2 /*return*/];
            });
        }); })());
    };
    FilterConsumerBridgeToSqlRequest.prototype.addToWhere = function (x) {
        if (this.where.length == 0) {
            if (this._addWhere)
                this.where += ' where ';
        }
        else
            this.where += ' and ';
        this.where += x;
    };
    FilterConsumerBridgeToSqlRequest.prototype.databaseCustom = function (databaseCustom) {
        var _this = this;
        this.promises.push((function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var item, sql;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(databaseCustom === null || databaseCustom === void 0 ? void 0 : databaseCustom.buildSql)) return [3 /*break*/, 2];
                        item = new CustomSqlFilterBuilder(this.r, this.nameProvider.wrapIdentifier);
                        return [4 /*yield*/, databaseCustom.buildSql(item)];
                    case 1:
                        sql = _a.sent();
                        if (typeof sql !== 'string')
                            sql = item.sql;
                        if (sql) {
                            this.addToWhere('(' + sql + ')');
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); })());
    };
    return FilterConsumerBridgeToSqlRequest;
}());
exports.FilterConsumerBridgeToSqlRequest = FilterConsumerBridgeToSqlRequest;
/**
 * Represents a custom SQL filter builder.
 */
var CustomSqlFilterBuilder = /** @class */ (function () {
    function CustomSqlFilterBuilder(r, wrapIdentifier) {
        var _this = this;
        this.r = r;
        this.wrapIdentifier = wrapIdentifier;
        this.sql = '';
        /**
         * Adds a parameter value.
         * @param {valueType} val - The value to add as a parameter.
         * @param {FieldMetadata<valueType>} [field] - The field metadata.
         * @returns {string} - The SQL token.
         */
        this.param = function (val, field) {
            if (typeof field === 'object' && field.valueConverter.toDb) {
                val = field.valueConverter.toDb(val);
            }
            return _this.r.param(val);
        };
        /**
         * Converts an entity filter into a raw SQL condition - and appends to it any `backendPrefilter` and `backendPreprocessFilter`
         * @param {RepositoryOverloads<entityType>} repo - The repository.
         * @param {EntityFilter<entityType>} condition - The entity filter.
         * @returns {Promise<string>} - The raw SQL.
         */
        this.filterToRaw = function (repo, condition) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, sql_database_js_1.SqlDatabase.filterToRaw(repo, condition, this, undefined, this.wrapIdentifier)];
            });
        }); };
        this.param.bind(this);
        this.filterToRaw.bind(this);
    }
    /** @deprecated  use `param` instead*/
    CustomSqlFilterBuilder.prototype.addParameterAndReturnSqlToken = function (val) {
        return this.param(val);
    };
    return CustomSqlFilterBuilder;
}());
exports.CustomSqlFilterBuilder = CustomSqlFilterBuilder;
function isDbReadonly(field, dbNames) {
    return (field.dbReadOnly ||
        field.isServerExpression ||
        (field.options.sqlExpression && field.dbName != dbNames.$dbNameOf(field)));
}
function shouldNotCreateField(field, dbNames) {
    return Boolean(field.isServerExpression ||
        (field.options.sqlExpression && field.dbName != dbNames.$dbNameOf(field)));
}
function shouldCreateEntity(entity, e) {
    return (!entity.options.sqlExpression &&
        e.$entityName.toLowerCase().indexOf('from ') < 0);
}
function dbNamesOf(repo, wrapIdentifierOrOptions) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, internalDbNamesOf(repo, wrapIdentifierOrOptions)];
        });
    });
}
function dbNamesOfWithForceSqlExpression(repo, wrapIdentifierOrOptions) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, internalDbNamesOf(repo, wrapIdentifierOrOptions, true)];
        });
    });
}
function internalDbNamesOf(repo_1, wrapIdentifierOrOptions_1) {
    return tslib_1.__awaiter(this, arguments, void 0, function (repo, wrapIdentifierOrOptions, forceSqlExpression) {
        var options, meta, result, _a, _b, field, r, e_3_1;
        var _c, e_3, _d;
        if (forceSqlExpression === void 0) { forceSqlExpression = false; }
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    options = typeof wrapIdentifierOrOptions === 'function'
                        ? { wrapIdentifier: wrapIdentifierOrOptions }
                        : wrapIdentifierOrOptions || {};
                    meta = (0, RepositoryImplementation_js_1.getEntityMetadata)(repo);
                    if (!options.wrapIdentifier) {
                        options.wrapIdentifier = remult_proxy_js_1.remult.dataProvider.wrapIdentifier;
                    }
                    if (!options.wrapIdentifier)
                        options.wrapIdentifier = function (x) { return x; };
                    _c = {};
                    return [4 /*yield*/, entityDbName(meta, options.wrapIdentifier)];
                case 1:
                    result = (_c.$entityName = _e.sent(),
                        _c.toString = function () { return result.$entityName; },
                        _c.$dbNameOf = function (field) {
                            var key;
                            if (typeof field === 'string')
                                key = field;
                            else
                                key = field.key;
                            return result[key];
                        },
                        _c.wrapIdentifier = options.wrapIdentifier,
                        _c);
                    _e.label = 2;
                case 2:
                    _e.trys.push([2, 7, 8, 9]);
                    _a = tslib_1.__values(meta.fields), _b = _a.next();
                    _e.label = 3;
                case 3:
                    if (!!_b.done) return [3 /*break*/, 6];
                    field = _b.value;
                    return [4 /*yield*/, fieldDbName(field, meta, options.wrapIdentifier, forceSqlExpression)];
                case 4:
                    r = _e.sent();
                    if (!field.options.sqlExpression)
                        if (typeof options.tableName === 'string')
                            r = options.wrapIdentifier(options.tableName) + '.' + r;
                        else if (options.tableName === true) {
                            r = result.$entityName + '.' + r;
                        }
                    ;
                    result[field.key] = r;
                    _e.label = 5;
                case 5:
                    _b = _a.next();
                    return [3 /*break*/, 3];
                case 6: return [3 /*break*/, 9];
                case 7:
                    e_3_1 = _e.sent();
                    e_3 = { error: e_3_1 };
                    return [3 /*break*/, 9];
                case 8:
                    try {
                        if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                    }
                    finally { if (e_3) throw e_3.error; }
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/, result];
            }
        });
    });
}
function entityDbName(metadata_1) {
    return tslib_1.__awaiter(this, arguments, void 0, function (metadata, wrapIdentifier) {
        var prev;
        if (wrapIdentifier === void 0) { wrapIdentifier = function (x) { return x; }; }
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!metadata.options.sqlExpression) return [3 /*break*/, 5];
                    if (!(typeof metadata.options.sqlExpression === 'string')) return [3 /*break*/, 1];
                    return [2 /*return*/, metadata.options.sqlExpression];
                case 1:
                    if (!(typeof metadata.options.sqlExpression === 'function')) return [3 /*break*/, 5];
                    prev = metadata.options.sqlExpression;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 4, 5]);
                    metadata.options.sqlExpression =
                        "recursive sqlExpression call for entity '" + metadata.key + "'. ";
                    return [4 /*yield*/, prev(metadata)];
                case 3: return [2 /*return*/, _a.sent()];
                case 4:
                    metadata.options.sqlExpression = prev;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/, wrapIdentifier(metadata.dbName)];
            }
        });
    });
}
var sqlExpressionInProgressKey = Symbol.for("sqlExpressionInProgressKey");
function fieldDbName(f_1, meta_1) {
    return tslib_1.__awaiter(this, arguments, void 0, function (f, meta, wrapIdentifier, forceSqlExpression) {
        var result_1, rel, field, fInfo;
        if (wrapIdentifier === void 0) { wrapIdentifier = function (x) { return x; }; }
        if (forceSqlExpression === void 0) { forceSqlExpression = false; }
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, , 8, 9]);
                    if (!f.options.sqlExpression) return [3 /*break*/, 7];
                    if (!(typeof f.options.sqlExpression === 'function')) return [3 /*break*/, 5];
                    if (f[sqlExpressionInProgressKey] && !forceSqlExpression) {
                        return [2 /*return*/, "recursive sqlExpression call for field '" + f.key + "'. \0"];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    ;
                    f[sqlExpressionInProgressKey] = true;
                    return [4 /*yield*/, f.options.sqlExpression(meta)];
                case 2:
                    result_1 = _a.sent();
                    if (!result_1.includes('\0'))
                        f.options.sqlExpression = function () { return result_1; };
                    return [3 /*break*/, 4];
                case 3:
                    delete f[sqlExpressionInProgressKey];
                    return [7 /*endfinally*/];
                case 4: return [3 /*break*/, 6];
                case 5:
                    result_1 = f.options.sqlExpression;
                    _a.label = 6;
                case 6:
                    if (!result_1)
                        return [2 /*return*/, f.dbName];
                    return [2 /*return*/, result_1];
                case 7:
                    rel = (0, relationInfoMember_js_1.getRelationFieldInfo)(f);
                    field = (rel === null || rel === void 0 ? void 0 : rel.type) === 'toOne' &&
                        f.options.field;
                    if (field) {
                        fInfo = meta.fields.find(field);
                        if (fInfo)
                            return [2 /*return*/, fieldDbName(fInfo, meta, wrapIdentifier, forceSqlExpression)];
                    }
                    return [2 /*return*/, wrapIdentifier(f.dbName)];
                case 8: return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    });
}
