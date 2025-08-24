"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuckDBDataProvider = void 0;
var tslib_1 = require("tslib");
var remult_sqlite_core_js_1 = require("./remult-sqlite-core.js");
var index_js_1 = require("./index.js");
var filter_consumer_bridge_to_sql_request_js_1 = require("./src/filter/filter-consumer-bridge-to-sql-request.js");
var RepositoryImplementation_js_1 = require("./src/remult3/RepositoryImplementation.js");
var DuckDBDataProvider = /** @class */ (function (_super) {
    tslib_1.__extends(DuckDBDataProvider, _super);
    function DuckDBDataProvider(db) {
        var _this = _super.call(this, function () { return new DuckDBCommand(db); }, function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db];
                case 1: return [2 /*return*/, (_a.sent()).close()];
            }
        }); }); }, false, true) || this;
        return _this;
    }
    DuckDBDataProvider.prototype.wrapIdentifier = function (name) {
        return "\"".concat(name, "\"");
    };
    DuckDBDataProvider.prototype.getCreateTableSql = function (entity) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result, e, sql, _a, _b, x, sequenceName;
            var e_1, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        result = '';
                        return [4 /*yield*/, (0, index_js_1.dbNamesOf)(entity, this.wrapIdentifier)];
                    case 1:
                        e = _d.sent();
                        sql = '';
                        try {
                            for (_a = tslib_1.__values(entity.fields), _b = _a.next(); !_b.done; _b = _a.next()) {
                                x = _b.value;
                                if (!(0, filter_consumer_bridge_to_sql_request_js_1.shouldNotCreateField)(x, e) || (0, RepositoryImplementation_js_1.isAutoIncrement)(x)) {
                                    if (result.length != 0)
                                        result += ',';
                                    result += '\r\n  ';
                                    if ((0, RepositoryImplementation_js_1.isAutoIncrement)(x)) {
                                        sequenceName = "".concat(entity.dbName, "_").concat(x.dbName, "_seq");
                                        sql += "create sequence if not exists \"".concat(sequenceName, "\";\r\n");
                                        result += "".concat(e.$dbNameOf(x), " integer default nextval('").concat(sequenceName, "')");
                                    }
                                    else {
                                        result += this.addColumnSqlSyntax(x, e.$dbNameOf(x), false);
                                    }
                                }
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        result += ",\r\n   primary key (".concat(entity.idMetadata.fields
                            .map(function (f) { return e.$dbNameOf(f); })
                            .join(','), ")");
                        sql +=
                            'create table if not exists ' + e.$entityName + ' (' + result + '\r\n)';
                        return [2 /*return*/, [sql]];
                }
            });
        });
    };
    DuckDBDataProvider.prototype.addColumnSqlSyntax = function (x, dbName, isAlterColumn) {
        var result = dbName;
        var allowNull = x.allowNull;
        if (!allowNull && isAlterColumn) {
            allowNull = true;
            console.log('DuckDB does not support altering columns to allow null on existing tables');
        }
        if (x.valueType == Number) {
            if (!x.valueConverter.fieldTypeInDb)
                result += ' numeric' + (allowNull ? '' : ' default 0 not null');
            else
                result +=
                    ' ' +
                        x.valueConverter.fieldTypeInDb +
                        (allowNull ? '' : ' default 0 not null');
        }
        else if (x.valueType == Date) {
            if (!x.valueConverter.fieldTypeInDb)
                if (x.valueConverter == index_js_1.ValueConverters.DateOnly)
                    result += ' date';
                else
                    result += ' timestamp';
            else
                result += ' ' + x.valueConverter.fieldTypeInDb;
        }
        else if (x.valueType == Boolean)
            result += ' boolean' + (allowNull ? '' : ' default false not null');
        else if (x.valueConverter.fieldTypeInDb) {
            result += ' ' + x.valueConverter.fieldTypeInDb;
            if (!allowNull && x.valueConverter.fieldTypeInDb == 'integer') {
                result += ' default 0 not null';
            }
        }
        else
            result += ' varchar' + (allowNull ? '' : " default '' not null");
        return result;
    };
    return DuckDBDataProvider;
}(remult_sqlite_core_js_1.SqliteCoreDataProvider));
exports.DuckDBDataProvider = DuckDBDataProvider;
var DuckDBCommand = /** @class */ (function () {
    function DuckDBCommand(db) {
        this.db = db;
        this.values = [];
    }
    DuckDBCommand.prototype.execute = function (sql) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, error) {
                        var _a;
                        (_a = _this.db).all.apply(_a, tslib_1.__spreadArray(tslib_1.__spreadArray([sql], tslib_1.__read(_this.values), false), [function (err, rows) {
                                if (err)
                                    error(err);
                                else
                                    resolve(new DuckDBSqlResult(rows));
                            }], false));
                    })];
            });
        });
    };
    DuckDBCommand.prototype.addParameterAndReturnSqlToken = function (val) {
        return this.param(val);
    };
    DuckDBCommand.prototype.param = function (val) {
        var key = '?';
        this.values.push(val);
        return key;
    };
    return DuckDBCommand;
}());
var DuckDBSqlResult = /** @class */ (function () {
    function DuckDBSqlResult(result) {
        this.result = result;
        this.rows = result;
    }
    DuckDBSqlResult.prototype.getColumnKeyInResultForIndexInSelect = function (index) {
        return Object.keys(this.result[0])[index];
    };
    return DuckDBSqlResult;
}());
