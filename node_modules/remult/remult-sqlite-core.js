"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqliteCoreDataProvider = void 0;
var tslib_1 = require("tslib");
var sql_database_js_1 = require("./src/data-providers/sql-database.js");
var filter_consumer_bridge_to_sql_request_js_1 = require("./src/filter/filter-consumer-bridge-to-sql-request.js");
var RepositoryImplementation_js_1 = require("./src/remult3/RepositoryImplementation.js");
var SqliteCoreDataProvider = /** @class */ (function () {
    function SqliteCoreDataProvider(createCommand, end, doesNotSupportReturningSyntax, doesNotSupportReturningSyntaxOnlyForUpdate) {
        if (doesNotSupportReturningSyntax === void 0) { doesNotSupportReturningSyntax = false; }
        if (doesNotSupportReturningSyntaxOnlyForUpdate === void 0) { doesNotSupportReturningSyntaxOnlyForUpdate = false; }
        this.createCommand = createCommand;
        this.end = end;
        this.doesNotSupportReturningSyntax = doesNotSupportReturningSyntax;
        this.doesNotSupportReturningSyntaxOnlyForUpdate = doesNotSupportReturningSyntaxOnlyForUpdate;
    }
    SqliteCoreDataProvider.prototype.getLimitSqlSyntax = function (limit, offset) {
        return ' limit ' + limit + ' offset ' + offset;
    };
    SqliteCoreDataProvider.prototype.provideMigrationBuilder = function (builder) {
        var _this = this;
        var self = this;
        return {
            createTable: function (entity) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, self.getCreateTableSql(entity)];
                        case 1: return [4 /*yield*/, (_a.sent()).map(builder.addSql)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); },
            addColumn: function (entity, field) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var e, sql;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, filter_consumer_bridge_to_sql_request_js_1.dbNamesOf)(entity, this.wrapIdentifier)];
                        case 1:
                            e = _a.sent();
                            sql = "alter table ".concat(e.$entityName, " add column ").concat(self.addColumnSqlSyntax(field, e.$dbNameOf(field), true));
                            builder.addSql(sql);
                            return [2 /*return*/];
                    }
                });
            }); },
        };
    };
    SqliteCoreDataProvider.prototype.transaction = function (action) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var err_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createCommand().execute('Begin Transaction')];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 7]);
                        return [4 /*yield*/, action(this)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.createCommand().execute('Commit')];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 5:
                        err_1 = _a.sent();
                        return [4 /*yield*/, this.createCommand().execute('Rollback')];
                    case 6:
                        _a.sent();
                        throw err_1;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    SqliteCoreDataProvider.prototype.entityIsUsedForTheFirstTime = function (entity) {
        return tslib_1.__awaiter(this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    SqliteCoreDataProvider.prototype.ensureSchema = function (entities) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var entities_1, entities_1_1, entity, e_1_1;
            var e_1, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, 7, 8]);
                        entities_1 = tslib_1.__values(entities), entities_1_1 = entities_1.next();
                        _b.label = 1;
                    case 1:
                        if (!!entities_1_1.done) return [3 /*break*/, 5];
                        entity = entities_1_1.value;
                        return [4 /*yield*/, this.createTableIfNotExist(entity)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.verifyAllColumns(entity)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        entities_1_1 = entities_1.next();
                        return [3 /*break*/, 1];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (entities_1_1 && !entities_1_1.done && (_a = entities_1.return)) _a.call(entities_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    SqliteCoreDataProvider.prototype.verifyAllColumns = function (entity) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var cmd, e, cols, _a, _b, col, colName, sql, e_2_1, err_2;
            var e_2, _c;
            var _this = this;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 11, , 12]);
                        cmd = this.createCommand();
                        return [4 /*yield*/, (0, filter_consumer_bridge_to_sql_request_js_1.dbNamesOf)(entity, this.wrapIdentifier)];
                    case 1:
                        e = _d.sent();
                        return [4 /*yield*/, cmd.execute("PRAGMA table_info(".concat(e.$entityName, ")"))];
                    case 2:
                        cols = (_d.sent()).rows.map(function (x) { return _this.wrapIdentifier(x.name.toLocaleLowerCase()); });
                        _d.label = 3;
                    case 3:
                        _d.trys.push([3, 8, 9, 10]);
                        _a = tslib_1.__values(entity.fields), _b = _a.next();
                        _d.label = 4;
                    case 4:
                        if (!!_b.done) return [3 /*break*/, 7];
                        col = _b.value;
                        if (!!(0, filter_consumer_bridge_to_sql_request_js_1.shouldNotCreateField)(col, e)) return [3 /*break*/, 6];
                        colName = e.$dbNameOf(col).toLocaleLowerCase();
                        if (!!cols.includes(colName)) return [3 /*break*/, 6];
                        sql = "ALTER table ".concat(e.$entityName, " ") +
                            "add column ".concat(this.addColumnSqlSyntax(col, e.$dbNameOf(col), true));
                        return [4 /*yield*/, this.createCommand().execute(sql)];
                    case 5:
                        _d.sent();
                        _d.label = 6;
                    case 6:
                        _b = _a.next();
                        return [3 /*break*/, 4];
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        e_2_1 = _d.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 10];
                    case 9:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        err_2 = _d.sent();
                        console.error(err_2);
                        return [3 /*break*/, 12];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    SqliteCoreDataProvider.prototype.dropTable = function (entity) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var e, sql;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, filter_consumer_bridge_to_sql_request_js_1.dbNamesOf)(entity, this.wrapIdentifier)];
                    case 1:
                        e = _a.sent();
                        sql = 'drop  table if exists ' + e.$entityName;
                        if (sql_database_js_1.SqlDatabase.LogToConsole)
                            console.info(sql);
                        return [4 /*yield*/, this.createCommand().execute(sql)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SqliteCoreDataProvider.prototype.addColumnSqlSyntax = function (x, dbName, isAlterTable) {
        var result = dbName;
        var nullNumber = x.allowNull ? '' : ' default 0 not null';
        if (x.valueType == Date)
            result += ' integer';
        else if (x.valueType == Boolean)
            result += ' integer ' + nullNumber;
        else if (x.valueType == Number) {
            if (!x.valueConverter.fieldTypeInDb)
                result += ' numeric ' + nullNumber;
            else
                result += ' ' + x.valueConverter.fieldTypeInDb + ' ' + nullNumber;
        }
        else
            result += ' text' + (x.allowNull ? ' ' : " default '' not null ");
        return result;
    };
    SqliteCoreDataProvider.prototype.createTableIfNotExist = function (entity) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var sql, sql_1, sql_1_1, element, e_3_1;
            var e_3, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getCreateTableSql(entity)];
                    case 1:
                        sql = _b.sent();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 7, 8, 9]);
                        sql_1 = tslib_1.__values(sql), sql_1_1 = sql_1.next();
                        _b.label = 3;
                    case 3:
                        if (!!sql_1_1.done) return [3 /*break*/, 6];
                        element = sql_1_1.value;
                        return [4 /*yield*/, this.createCommand().execute(element)];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5:
                        sql_1_1 = sql_1.next();
                        return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        e_3_1 = _b.sent();
                        e_3 = { error: e_3_1 };
                        return [3 /*break*/, 9];
                    case 8:
                        try {
                            if (sql_1_1 && !sql_1_1.done && (_a = sql_1.return)) _a.call(sql_1);
                        }
                        finally { if (e_3) throw e_3.error; }
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    SqliteCoreDataProvider.prototype.getCreateTableSql = function (entity) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result, e, _a, _b, x, sql;
            var e_4, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        result = '';
                        return [4 /*yield*/, (0, filter_consumer_bridge_to_sql_request_js_1.dbNamesOf)(entity, this.wrapIdentifier)];
                    case 1:
                        e = _d.sent();
                        try {
                            for (_a = tslib_1.__values(entity.fields), _b = _a.next(); !_b.done; _b = _a.next()) {
                                x = _b.value;
                                if (!(0, filter_consumer_bridge_to_sql_request_js_1.shouldNotCreateField)(x, e) || (0, RepositoryImplementation_js_1.isAutoIncrement)(x)) {
                                    if (result.length != 0)
                                        result += ',';
                                    result += '\r\n  ';
                                    if ((0, RepositoryImplementation_js_1.isAutoIncrement)(x)) {
                                        if (x.key != entity.idMetadata.field.key)
                                            throw 'in sqlite, autoincrement is only allowed for primary key';
                                        result += e.$dbNameOf(x) + ' integer primary key autoincrement';
                                    }
                                    else {
                                        result += this.addColumnSqlSyntax(x, e.$dbNameOf(x), false);
                                        if (x.key == entity.idMetadata.field.key) {
                                            result += ' primary key';
                                        }
                                    }
                                }
                            }
                        }
                        catch (e_4_1) { e_4 = { error: e_4_1 }; }
                        finally {
                            try {
                                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                            }
                            finally { if (e_4) throw e_4.error; }
                        }
                        sql = [
                            'create table if not exists ' + e.$entityName + ' (' + result + '\r\n)',
                        ];
                        if (entity.idMetadata.fields.length > 1) {
                            sql.push("create unique index if not exists ".concat(this.wrapIdentifier(entity.dbName + '_primary_key'), " on ").concat(e.$entityName, "  (").concat(entity.idMetadata.fields
                                .map(function (x) { return e.$dbNameOf(x); })
                                .join(','), ")"));
                        }
                        return [2 /*return*/, sql];
                }
            });
        });
    };
    SqliteCoreDataProvider.prototype.wrapIdentifier = function (name) {
        //return name
        return '`' + name + '`';
    };
    return SqliteCoreDataProvider;
}());
exports.SqliteCoreDataProvider = SqliteCoreDataProvider;
