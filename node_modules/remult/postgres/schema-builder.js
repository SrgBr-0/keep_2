"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresSchemaBuilder = void 0;
exports.postgresColumnSyntax = postgresColumnSyntax;
var tslib_1 = require("tslib");
var filter_consumer_bridge_to_sql_request_js_1 = require("../src/filter/filter-consumer-bridge-to-sql-request.js");
var RepositoryImplementation_js_1 = require("../src/remult3/RepositoryImplementation.js");
var valueConverters_js_1 = require("../src/valueConverters.js");
function postgresColumnSyntax(x, dbName) {
    var result = dbName;
    if (x.valueType == Number) {
        if (!x.valueConverter.fieldTypeInDb)
            result += ' numeric' + (x.allowNull ? '' : ' default 0 not null');
        else
            result +=
                ' ' +
                    x.valueConverter.fieldTypeInDb +
                    (x.allowNull ? '' : ' default 0 not null');
    }
    else if (x.valueType == Date) {
        if (!x.valueConverter.fieldTypeInDb)
            if (x.valueConverter == valueConverters_js_1.ValueConverters.DateOnly)
                result += ' date';
            else
                result += ' timestamptz';
        else
            result += ' ' + x.valueConverter.fieldTypeInDb;
    }
    else if (x.valueType == Boolean)
        result += ' boolean' + (x.allowNull ? '' : ' default false not null');
    else if (x.valueConverter.fieldTypeInDb) {
        result += ' ' + x.valueConverter.fieldTypeInDb;
        if (!x.allowNull && x.valueConverter.fieldTypeInDb == 'integer') {
            result += ' default 0 not null';
        }
    }
    else
        result += ' varchar' + (x.allowNull ? '' : " default '' not null");
    return result;
}
var PostgresSchemaBuilder = /** @class */ (function () {
    function PostgresSchemaBuilder(pool, schema) {
        this.pool = pool;
        this.specifiedSchema = '';
        if (schema) {
            this.specifiedSchema = schema;
        }
    }
    PostgresSchemaBuilder.prototype.removeQuotes = function (s) {
        if (s.startsWith('"') && s.endsWith('"')) {
            return s.substring(1, s.length - 1);
        }
        return s.toLocaleLowerCase();
    };
    PostgresSchemaBuilder.prototype.whereTableAndSchema = function (cmd, e) {
        var table = '';
        var schema = '';
        if (this.specifiedSchema) {
            schema = this.specifiedSchema;
        }
        var splited = e.$entityName.split('.');
        // let's prioritize the specified schema at dbName level
        if (splited.length > 1) {
            schema = splited[0];
            table = splited[1];
        }
        else {
            table = splited[0];
        }
        var where = [];
        if (schema) {
            where.push("table_schema=".concat(cmd.param(this.removeQuotes(schema))));
        }
        where.push("table_name=".concat(cmd.param(this.removeQuotes(table))));
        return where.join(' AND ');
    };
    PostgresSchemaBuilder.prototype.schemaAndName = function (e) {
        if (e.$entityName.includes('.')) {
            return e.$entityName;
        }
        if (this.specifiedSchema) {
            return "".concat(this.specifiedSchema, ".").concat(e.$entityName);
        }
        return e.$entityName;
    };
    PostgresSchemaBuilder.prototype.schemaOnly = function (e) {
        if (e.$entityName.includes('.')) {
            return e.$entityName.split('.')[0];
        }
        if (this.specifiedSchema) {
            return this.specifiedSchema;
        }
        // Should default to `public`
        return 'public';
    };
    PostgresSchemaBuilder.prototype.ensureSchema = function (entities) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var entities_1, entities_1_1, entity, e, err_1, e_1_1;
            var e_1, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 10, 11, 12]);
                        entities_1 = tslib_1.__values(entities), entities_1_1 = entities_1.next();
                        _b.label = 1;
                    case 1:
                        if (!!entities_1_1.done) return [3 /*break*/, 9];
                        entity = entities_1_1.value;
                        return [4 /*yield*/, (0, filter_consumer_bridge_to_sql_request_js_1.dbNamesOf)(entity, this.pool.wrapIdentifier)];
                    case 2:
                        e = _b.sent();
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 7, , 8]);
                        if (!(0, filter_consumer_bridge_to_sql_request_js_1.shouldCreateEntity)(entity, e)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.createIfNotExist(entity)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, this.verifyAllColumns(entity)];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        err_1 = _b.sent();
                        console.error('failed verify structure of ' + e.$entityName + ' ', err_1);
                        throw err_1;
                    case 8:
                        entities_1_1 = entities_1.next();
                        return [3 /*break*/, 1];
                    case 9: return [3 /*break*/, 12];
                    case 10:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 12];
                    case 11:
                        try {
                            if (entities_1_1 && !entities_1_1.done && (_a = entities_1.return)) _a.call(entities_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    PostgresSchemaBuilder.prototype.createIfNotExist = function (entity) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var c, e;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        c = this.pool.createCommand();
                        return [4 /*yield*/, (0, filter_consumer_bridge_to_sql_request_js_1.dbNamesOf)(entity, this.pool.wrapIdentifier)];
                    case 1:
                        e = _a.sent();
                        return [4 /*yield*/, c
                                .execute("SELECT 1 FROM information_Schema.tables WHERE " +
                                "".concat(this.whereTableAndSchema(c, e)))
                                .then(function (r) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var sql;
                                return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(r.rows.length == 0)) return [3 /*break*/, 3];
                                            return [4 /*yield*/, this.createTableScript(entity)];
                                        case 1:
                                            sql = _a.sent();
                                            if (PostgresSchemaBuilder.logToConsole)
                                                console.info(sql);
                                            return [4 /*yield*/, this.pool.execute(sql)];
                                        case 2:
                                            _a.sent();
                                            _a.label = 3;
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /* @internal*/
    PostgresSchemaBuilder.prototype.getAddColumnScript = function (entity, field) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var e;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, filter_consumer_bridge_to_sql_request_js_1.dbNamesOf)(entity, this.pool.wrapIdentifier)];
                    case 1:
                        e = _a.sent();
                        return [2 /*return*/, ("ALTER table ".concat(this.schemaAndName(e), " ") +
                                "ADD column ".concat(postgresColumnSyntax(field, e.$dbNameOf(field))))];
                }
            });
        });
    };
    /* @internal*/
    PostgresSchemaBuilder.prototype.createTableScript = function (entity) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result, e, _a, _b, x, sql;
            var e_2, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        result = '';
                        return [4 /*yield*/, (0, filter_consumer_bridge_to_sql_request_js_1.dbNamesOf)(entity, this.pool.wrapIdentifier)];
                    case 1:
                        e = _d.sent();
                        try {
                            for (_a = tslib_1.__values(entity.fields), _b = _a.next(); !_b.done; _b = _a.next()) {
                                x = _b.value;
                                if (!(0, filter_consumer_bridge_to_sql_request_js_1.shouldNotCreateField)(x, e) || (0, RepositoryImplementation_js_1.isAutoIncrement)(x)) {
                                    if (result.length != 0)
                                        result += ',';
                                    result += '\r\n  ';
                                    if ((0, RepositoryImplementation_js_1.isAutoIncrement)(x))
                                        result += e.$dbNameOf(x) + ' serial';
                                    else {
                                        result += postgresColumnSyntax(x, e.$dbNameOf(x));
                                    }
                                }
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        result += ",\r\n   primary key (".concat(entity.idMetadata.fields
                            .map(function (f) { return e.$dbNameOf(f); })
                            .join(','), ")");
                        sql = "CREATE SCHEMA IF NOT EXISTS ".concat(this.schemaOnly(e), ";\nCREATE table ").concat(this.schemaAndName(e), " (").concat(result, "\r\n)");
                        return [2 /*return*/, sql];
                }
            });
        });
    };
    PostgresSchemaBuilder.prototype.verifyAllColumns = function (entity) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var cmd, e, cols, _a, _b, col, colName, sql, e_3_1, err_2;
            var e_3, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 11, , 12]);
                        cmd = this.pool.createCommand();
                        return [4 /*yield*/, (0, filter_consumer_bridge_to_sql_request_js_1.dbNamesOf)(entity, this.pool.wrapIdentifier)];
                    case 1:
                        e = _d.sent();
                        return [4 /*yield*/, cmd.execute("SELECT column_name FROM information_schema.columns WHERE " +
                                "".concat(this.whereTableAndSchema(cmd, e)))];
                    case 2:
                        cols = (_d.sent()).rows.map(function (x) { return x.column_name.toLocaleLowerCase(); });
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
                        if (colName.startsWith('"') && colName.endsWith('"'))
                            colName = colName.substring(1, colName.length - 1);
                        if (!!cols.includes(colName)) return [3 /*break*/, 6];
                        sql = "ALTER table ".concat(this.schemaAndName(e), " ") +
                            "add column ".concat(postgresColumnSyntax(col, e.$dbNameOf(col)));
                        if (PostgresSchemaBuilder.logToConsole)
                            console.info(sql);
                        return [4 /*yield*/, this.pool.execute(sql)];
                    case 5:
                        _d.sent();
                        _d.label = 6;
                    case 6:
                        _b = _a.next();
                        return [3 /*break*/, 4];
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        e_3_1 = _d.sent();
                        e_3 = { error: e_3_1 };
                        return [3 /*break*/, 10];
                    case 9:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_3) throw e_3.error; }
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
    //@internal
    PostgresSchemaBuilder.logToConsole = true;
    return PostgresSchemaBuilder;
}());
exports.PostgresSchemaBuilder = PostgresSchemaBuilder;
