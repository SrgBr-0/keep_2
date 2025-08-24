"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresSchemaWrapper = exports.PostgresDataProvider = void 0;
exports.createPostgresConnection = createPostgresConnection;
exports.createPostgresDataProvider = createPostgresDataProvider;
exports.preparePostgresQueueStorage = preparePostgresQueueStorage;
var tslib_1 = require("tslib");
var remult_proxy_js_1 = require("../src/remult-proxy.js");
var pg_1 = tslib_1.__importDefault(require("pg"));
var Pool = pg_1.default.Pool;
var context_js_1 = require("../src/context.js");
var sql_database_js_1 = require("../src/data-providers/sql-database.js");
var schema_builder_js_1 = require("./schema-builder.js");
var PostgresDataProvider = /** @class */ (function () {
    function PostgresDataProvider(pool, options) {
        this.pool = pool;
        this.options = options;
        this.supportsJsonColumnType = true;
        this.wrapIdentifier = function (name) {
            return name
                .split('.')
                .map(function (name) {
                return name.startsWith('"') ? name : '"' + name.replace(/"/g, '""') + '"';
            })
                .join('.');
        };
        if (options === null || options === void 0 ? void 0 : options.wrapIdentifier)
            this.wrapIdentifier = options.wrapIdentifier;
        if (!(options === null || options === void 0 ? void 0 : options.wrapIdentifier) && (options === null || options === void 0 ? void 0 : options.caseInsensitiveIdentifiers))
            this.wrapIdentifier = function (name) { return name; };
        if (options === null || options === void 0 ? void 0 : options.orderByNullsFirst)
            this.orderByNullsFirst = options.orderByNullsFirst;
        if (options === null || options === void 0 ? void 0 : options.schema) {
            this.pool = new PostgresSchemaWrapper(pool, options.schema);
        }
    }
    PostgresDataProvider.getDb = function (dataProvider) {
        var r = (dataProvider || remult_proxy_js_1.remult.dataProvider);
        if (!r._getSourceSql)
            throw 'the data provider is not an SqlDatabase';
        var me = r._getSourceSql();
        if (!me.pool) {
            throw 'the data provider is not a PostgresDataProvider';
        }
        return me.pool;
    };
    PostgresDataProvider.prototype.entityIsUsedForTheFirstTime = function (entity) {
        return tslib_1.__awaiter(this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    PostgresDataProvider.prototype.getLimitSqlSyntax = function (limit, offset) {
        return ' limit ' + limit + ' offset ' + offset;
    };
    PostgresDataProvider.prototype.createCommand = function () {
        return new PostgresBridgeToSQLCommand(this.pool);
    };
    PostgresDataProvider.prototype.end = function () {
        return this.pool.end();
    };
    PostgresDataProvider.prototype.provideMigrationBuilder = function (builder) {
        var _this = this;
        var _a;
        var db = new sql_database_js_1.SqlDatabase(this);
        var sb = new schema_builder_js_1.PostgresSchemaBuilder(db, (_a = this.options) === null || _a === void 0 ? void 0 : _a.schema);
        return {
            addColumn: function (meta, field) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return tslib_1.__generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _b = (_a = builder).addSql;
                            return [4 /*yield*/, sb.getAddColumnScript(meta, field)];
                        case 1:
                            _b.apply(_a, [_c.sent()]);
                            return [2 /*return*/];
                    }
                });
            }); },
            createTable: function (meta) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return tslib_1.__generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _b = (_a = builder).addSql;
                            return [4 /*yield*/, sb.createTableScript(meta)];
                        case 1:
                            _b.apply(_a, [_c.sent()]);
                            return [2 /*return*/];
                    }
                });
            }); },
        };
    };
    PostgresDataProvider.prototype.ensureSchema = function (entities) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var db, sb;
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        db = new sql_database_js_1.SqlDatabase(this);
                        sb = new schema_builder_js_1.PostgresSchemaBuilder(db, (_a = this.options) === null || _a === void 0 ? void 0 : _a.schema);
                        return [4 /*yield*/, sb.ensureSchema(entities)];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PostgresDataProvider.prototype.transaction = function (action) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var client, err_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pool.connect()];
                    case 1:
                        client = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 6, 8, 10]);
                        return [4 /*yield*/, client.query('BEGIN')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, action({
                                createCommand: function () { return new PostgresBridgeToSQLCommand(client); },
                                entityIsUsedForTheFirstTime: this.entityIsUsedForTheFirstTime,
                                transaction: function () {
                                    throw 'nested transactions not allowed';
                                },
                                getLimitSqlSyntax: this.getLimitSqlSyntax,
                                supportsJsonColumnType: this.supportsJsonColumnType,
                                //@ts-ignore
                                pool: client,
                                wrapIdentifier: this.wrapIdentifier,
                                orderByNullsFirst: this.orderByNullsFirst,
                            })];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, client.query('COMMIT')];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 10];
                    case 6:
                        err_1 = _a.sent();
                        return [4 /*yield*/, client.query('ROLLBACK')];
                    case 7:
                        _a.sent();
                        throw err_1;
                    case 8: return [4 /*yield*/, client.release()];
                    case 9:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    return PostgresDataProvider;
}());
exports.PostgresDataProvider = PostgresDataProvider;
var PostgresBridgeToSQLCommand = /** @class */ (function () {
    function PostgresBridgeToSQLCommand(source) {
        this.source = source;
        this.values = [];
    }
    PostgresBridgeToSQLCommand.prototype.addParameterAndReturnSqlToken = function (val) {
        return this.param(val);
    };
    PostgresBridgeToSQLCommand.prototype.param = function (val) {
        if (Array.isArray(val))
            val = JSON.stringify(val);
        this.values.push(val);
        return '$' + this.values.length;
    };
    PostgresBridgeToSQLCommand.prototype.execute = function (sql) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.source
                        .query(sql, this.values)
                        .then(function (r) { return new PostgresBridgeToSQLQueryResult(r); })];
            });
        });
    };
    return PostgresBridgeToSQLCommand;
}());
var PostgresBridgeToSQLQueryResult = /** @class */ (function () {
    function PostgresBridgeToSQLQueryResult(r) {
        this.r = r;
        this.rows = r.rows;
    }
    PostgresBridgeToSQLQueryResult.prototype.getColumnKeyInResultForIndexInSelect = function (index) {
        return this.r.fields[index].name;
    };
    return PostgresBridgeToSQLQueryResult;
}());
function createPostgresConnection(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, createPostgresDataProvider(options)];
        });
    });
}
function createPostgresDataProvider(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var config, db;
        return tslib_1.__generator(this, function (_a) {
            if (!options)
                options = {};
            config = {};
            if (options.configuration)
                if (options.configuration == 'heroku') {
                    config = {
                        connectionString: process.env.DATABASE_URL,
                        ssl: process.env.NODE_ENV !== 'production' && !options.sslInDev
                            ? false
                            : {
                                rejectUnauthorized: false,
                            },
                    };
                }
                else
                    config = options.configuration;
            else {
                if (!options.connectionString)
                    options.connectionString = process.env.DATABASE_URL;
            }
            if (!config.connectionString && options.connectionString) {
                config.connectionString = options.connectionString;
            }
            db = new sql_database_js_1.SqlDatabase(new PostgresDataProvider(new Pool(config), {
                wrapIdentifier: options.wrapIdentifier,
                caseInsensitiveIdentifiers: options.caseInsensitiveIdentifiers,
                schema: options.schema,
                orderByNullsFirst: options.orderByNullsFirst,
            }));
            return [2 /*return*/, db];
        });
    });
}
function preparePostgresQueueStorage(sql) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var c, JobsInQueueEntity, e;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    c = new context_js_1.Remult();
                    c.dataProvider = sql;
                    return [4 /*yield*/, Promise.resolve().then(function () { return tslib_1.__importStar(require('../server/remult-api-server.js')); })];
                case 1:
                    JobsInQueueEntity = (_a.sent())
                        .JobsInQueueEntity;
                    e = c.repo(JobsInQueueEntity);
                    return [4 /*yield*/, sql.ensureSchema([e.metadata])];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, Promise.resolve().then(function () { return tslib_1.__importStar(require('../server/remult-api-server.js')); })];
                case 3: return [2 /*return*/, new (_a.sent()).EntityQueueStorage(c.repo(JobsInQueueEntity))];
            }
        });
    });
}
var PostgresSchemaWrapper = /** @class */ (function () {
    function PostgresSchemaWrapper(pool, schema) {
        this.pool = pool;
        this.schema = schema;
    }
    PostgresSchemaWrapper.prototype.connect = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var r;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pool.connect()];
                    case 1:
                        r = _a.sent();
                        return [4 /*yield*/, r.query('set search_path to ' + this.schema)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, r];
                }
            });
        });
    };
    PostgresSchemaWrapper.prototype.query = function (queryText, values) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var c;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connect()];
                    case 1:
                        c = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, , 4, 5]);
                        return [4 /*yield*/, c.query(queryText, values)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        c.release();
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    PostgresSchemaWrapper.prototype.end = function () {
        return this.pool.end();
    };
    return PostgresSchemaWrapper;
}());
exports.PostgresSchemaWrapper = PostgresSchemaWrapper;
