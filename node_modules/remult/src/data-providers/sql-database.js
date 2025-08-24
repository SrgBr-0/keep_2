"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlDatabase = void 0;
exports.getRowAfterUpdate = getRowAfterUpdate;
exports.groupByImpl = groupByImpl;
var tslib_1 = require("tslib");
var filter_consumer_bridge_to_sql_request_js_1 = require("../filter/filter-consumer-bridge-to-sql-request.js");
var filter_interfaces_js_1 = require("../filter/filter-interfaces.js");
var remult_proxy_js_1 = require("../remult-proxy.js");
var remult3_js_1 = require("../remult3/remult3.js");
var RepositoryImplementation_js_1 = require("../remult3/RepositoryImplementation.js");
var sort_js_1 = require("../sort.js");
var valueConverters_js_1 = require("../valueConverters.js");
var repository_internals_js_1 = require("../remult3/repository-internals.js");
var isOfType_js_1 = require("../isOfType.js");
/**
 * A DataProvider for Sql Databases
 * @example
 * const db = new SqlDatabase(new PostgresDataProvider(pgPool))
* @see [Connecting a Database](https://remult.dev/docs/quickstart#connecting-a-database)

 */
var SqlDatabase = /** @class */ (function () {
    /**
     * Creates a new SQL database.
     * @param sql - The SQL implementation.
     * @example
     * const db = new SqlDatabase(new PostgresDataProvider(pgPool))
     */
    function SqlDatabase(sql) {
        this.sql = sql;
        /**
         * Wraps an identifier with the database's identifier syntax.
         */
        this.wrapIdentifier = function (x) { return x; };
        this.createdEntities = [];
        if (sql.wrapIdentifier)
            this.wrapIdentifier = function (x) { return sql.wrapIdentifier(x); };
        if ((0, isOfType_js_1.isOfType)(sql, 'provideMigrationBuilder')) {
            this.provideMigrationBuilder = function (x) { return sql.provideMigrationBuilder(x); };
        }
        if ((0, isOfType_js_1.isOfType)(sql, 'end'))
            this.end = function () { return sql.end(); };
    }
    /**
     * Gets the SQL database from the data provider.
     * @param dataProvider - The data provider.
     * @returns The SQL database.
     * @see [Direct Database Access](https://remult.dev/docs/running-sql-on-the-server)
     */
    SqlDatabase.getDb = function (dataProvider) {
        var r = (dataProvider || remult_proxy_js_1.remult.dataProvider);
        if ((0, isOfType_js_1.isOfType)(r, 'createCommand'))
            return r;
        else
            throw 'the data provider is not an SqlCommandFactory';
    };
    /**
     * Creates a new SQL command.
     * @returns The SQL command.
     * @see [Direct Database Access](https://remult.dev/docs/running-sql-on-the-server)
     */
    SqlDatabase.prototype.createCommand = function () {
        return new LogSQLCommand(this.sql.createCommand(), SqlDatabase.LogToConsole);
    };
    /**
     * Executes a SQL command.
     * @param sql - The SQL command.
     * @returns The SQL result.
     * @see [Direct Database Access](https://remult.dev/docs/running-sql-on-the-server)
     */
    SqlDatabase.prototype.execute = function (sql) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createCommand().execute(sql)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /* @internal*/
    SqlDatabase.prototype._getSourceSql = function () {
        return this.sql;
    };
    SqlDatabase.prototype.ensureSchema = function (entities) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.sql.ensureSchema) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.sql.ensureSchema(entities)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Gets the entity data provider.
     * @param entity  - The entity metadata.
     * @returns The entity data provider.
     */
    SqlDatabase.prototype.getEntityDataProvider = function (entity) {
        var e_1, _a;
        var _this = this;
        if (!this.sql.supportsJsonColumnType) {
            try {
                for (var _b = tslib_1.__values(entity.fields.toArray()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var f = _c.value;
                    if (f.valueConverter.fieldTypeInDb === 'json') {
                        //@ts-ignore
                        f.valueConverter = tslib_1.__assign(tslib_1.__assign({}, f.valueConverter), { toDb: valueConverters_js_1.ValueConverters.JsonString.toDb, fromDb: valueConverters_js_1.ValueConverters.JsonString.fromDb });
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        return new ActualSQLEntityDataProvider(entity, this, function (dbName) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.createdEntities.indexOf(dbName.$entityName) < 0)) return [3 /*break*/, 2];
                        this.createdEntities.push(dbName.$entityName);
                        return [4 /*yield*/, this.sql.entityIsUsedForTheFirstTime(entity)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); }, this.sql);
    };
    /**
     * Runs a transaction. Used internally by remult when transactions are required
     * @param action - The action to run in the transaction.
     * @returns The promise of the transaction.
     */
    SqlDatabase.prototype.transaction = function (action) {
        var _this = this;
        return this.sql.transaction(function (x) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var completed;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        completed = false;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 3, 4]);
                        return [4 /*yield*/, action(new SqlDatabase({
                                createCommand: function () {
                                    var c = x.createCommand();
                                    return {
                                        addParameterAndReturnSqlToken: function (val) {
                                            return c.param(val);
                                        },
                                        param: function (x) { return c.param(x); },
                                        execute: function (sql) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                            return tslib_1.__generator(this, function (_a) {
                                                if (completed)
                                                    throw "can't run a command after the transaction was completed";
                                                return [2 /*return*/, c.execute(sql)];
                                            });
                                        }); },
                                    };
                                },
                                getLimitSqlSyntax: this.sql.getLimitSqlSyntax,
                                entityIsUsedForTheFirstTime: function (y) {
                                    return x.entityIsUsedForTheFirstTime(y);
                                },
                                transaction: function (z) { return x.transaction(z); },
                                supportsJsonColumnType: this.sql.supportsJsonColumnType,
                                wrapIdentifier: this.wrapIdentifier,
                                end: this.end,
                                doesNotSupportReturningSyntax: this.sql.doesNotSupportReturningSyntax,
                                doesNotSupportReturningSyntaxOnlyForUpdate: this.sql.doesNotSupportReturningSyntaxOnlyForUpdate,
                                orderByNullsFirst: this.sql.orderByNullsFirst,
                            }))];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        completed = true;
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * Creates a raw filter for entity filtering.
     * @param {CustomSqlFilterBuilderFunction} build - The custom SQL filter builder function.
     * @returns {EntityFilter<any>} - The entity filter with a custom SQL filter.
     * @example
     * SqlDatabase.rawFilter(({param}) =>
          `"customerId" in (select id from customers where city = ${param(customerCity)})`
        )
     * @see [Leveraging Database Capabilities with Raw SQL in Custom Filters](https://remult.dev/docs/custom-filter.html#leveraging-database-capabilities-with-raw-sql-in-custom-filters)
     */
    SqlDatabase.rawFilter = function (build) {
        var _a;
        return _a = {},
            _a[filter_interfaces_js_1.customDatabaseFilterToken] = {
                buildSql: build,
            },
            _a;
    };
    /**
     *  Converts a filter to a raw SQL string.
     *  @see [Leveraging Database Capabilities with Raw SQL in Custom Filters](https://remult.dev/docs/running-sql-on-the-server#leveraging-entityfilter-for-sql-databases)
     
     */
    SqlDatabase.filterToRaw = function (repo, condition, sqlCommand, dbNames, wrapIdentifier) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var r, b, _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!sqlCommand) {
                            sqlCommand = new myDummySQLCommand();
                        }
                        r = (0, RepositoryImplementation_js_1.getRepository)(repo);
                        _a = filter_consumer_bridge_to_sql_request_js_1.FilterConsumerBridgeToSqlRequest.bind;
                        _b = [void 0, sqlCommand];
                        _c = dbNames;
                        if (_c) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, filter_consumer_bridge_to_sql_request_js_1.dbNamesOfWithForceSqlExpression)(r.metadata, wrapIdentifier)];
                    case 1:
                        _c = (_d.sent());
                        _d.label = 2;
                    case 2:
                        b = new (_a.apply(filter_consumer_bridge_to_sql_request_js_1.FilterConsumerBridgeToSqlRequest, _b.concat([_c])))();
                        b._addWhere = false;
                        return [4 /*yield*/, (0, repository_internals_js_1.getRepositoryInternals)(r)._translateWhereToFilter(condition)];
                    case 3: return [4 /*yield*/, (_d.sent()).__applyToConsumer(b)];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, b.resolveWhere()];
                    case 5: return [2 /*return*/, _d.sent()];
                }
            });
        });
    };
    /**
     * `false` _(default)_ - No logging
     *
     * `true` - to log all queries to the console
     *
     * `oneLiner` - to log all queries to the console as one line
     *
     * a `function` - to log all queries to the console as a custom format
     * @example
     * SqlDatabase.LogToConsole = (duration, query, args) => { console.log("be crazy ;)") }
     */
    SqlDatabase.LogToConsole = false;
    /**
     * Threshold in milliseconds for logging queries to the console.
     */
    SqlDatabase.durationThreshold = 0;
    return SqlDatabase;
}());
exports.SqlDatabase = SqlDatabase;
var icons = new Map([
    // CRUD
    ['INSERT', '⚪'], // Used to insert new data into a database.
    ['SELECT', '🔵'], // Used to select data from a database and retrieve it.
    ['UPDATE', '🟣'], // Used to update existing data within a database.
    ['DELETE', '🟤'], // Used to delete existing data from a database.
    // Additional
    ['CREATE', '🟩'], // Used to create a new table, or database.
    ['ALTER', '🟨'], // Used to modify an existing database object, such as a table.
    ['DROP', '🟥'], // Used to delete an entire table or database.
    ['TRUNCATE', '⬛'], // Used to remove all records from a table, including all spaces allocated for the records are removed.
    ['GRANT', '🟪'], // Used to give a specific user permission to perform certain tasks.
    ['REVOKE', '🟫'], // Used to take back permissions from a user.
]);
var LogSQLCommand = /** @class */ (function () {
    function LogSQLCommand(origin, logToConsole) {
        this.origin = origin;
        this.logToConsole = logToConsole;
        this.args = {};
    }
    LogSQLCommand.prototype.addParameterAndReturnSqlToken = function (val) {
        return this.param(val);
    };
    LogSQLCommand.prototype.param = function (val, name) {
        var r = this.origin.param(val);
        this.args[r] = val;
        return r;
    };
    LogSQLCommand.prototype.execute = function (sql) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var start, r, d, duration, rawSql, first, err_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        start = new Date();
                        return [4 /*yield*/, this.origin.execute(sql)];
                    case 1:
                        r = _a.sent();
                        if (this.logToConsole !== false) {
                            d = new Date().valueOf() - start.valueOf();
                            if (d >= SqlDatabase.durationThreshold) {
                                duration = d / 1000;
                                if (this.logToConsole === 'oneLiner') {
                                    rawSql = sql
                                        .replace(/(\r\n|\n|\r|\t)/gm, ' ')
                                        .replace(/  +/g, ' ')
                                        .trim();
                                    first = rawSql.split(' ')[0].toUpperCase();
                                    console.info("".concat(icons.get(first) || '💢', " (").concat(duration.toFixed(3), ") ").concat(rawSql, " ").concat(JSON.stringify(this.args)));
                                }
                                else if (typeof this.logToConsole === 'function') {
                                    this.logToConsole(duration, sql, this.args);
                                }
                                else {
                                    console.info(sql + '\n', { arguments: this.args, duration: duration });
                                }
                            }
                        }
                        return [2 /*return*/, r];
                    case 2:
                        err_1 = _a.sent();
                        console.error((err_1.message || 'Sql Error') + ':\n', sql, {
                            arguments: this.args,
                            error: err_1,
                        });
                        throw err_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return LogSQLCommand;
}());
var ActualSQLEntityDataProvider = /** @class */ (function () {
    function ActualSQLEntityDataProvider(entity, sql, iAmUsed, strategy) {
        this.entity = entity;
        this.sql = sql;
        this.iAmUsed = iAmUsed;
        this.strategy = strategy;
    }
    ActualSQLEntityDataProvider.prototype.init = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var dbNameProvider;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, filter_consumer_bridge_to_sql_request_js_1.dbNamesOfWithForceSqlExpression)(this.entity, function (x) {
                            return _this.sql.wrapIdentifier(x);
                        })];
                    case 1:
                        dbNameProvider = _a.sent();
                        return [4 /*yield*/, this.iAmUsed(dbNameProvider)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, dbNameProvider];
                }
            });
        });
    };
    ActualSQLEntityDataProvider.prototype.count = function (where) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var e, select, r, wc, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.init()];
                    case 1:
                        e = _b.sent();
                        select = 'select count(*) count from ' + e.$entityName;
                        r = this.sql.createCommand();
                        if (!where) return [3 /*break*/, 3];
                        wc = new filter_consumer_bridge_to_sql_request_js_1.FilterConsumerBridgeToSqlRequest(r, e);
                        where.__applyToConsumer(wc);
                        _a = select;
                        return [4 /*yield*/, wc.resolveWhere()];
                    case 2:
                        select = _a + _b.sent();
                        _b.label = 3;
                    case 3: return [2 /*return*/, r.execute(select).then(function (r) {
                            return Number(r.rows[0].count);
                        })];
                }
            });
        });
    };
    ActualSQLEntityDataProvider.prototype.groupBy = function (options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = groupByImpl;
                        _b = [options];
                        return [4 /*yield*/, this.init()];
                    case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([_c.sent(), this.sql.createCommand(),
                            this.sql._getSourceSql().orderByNullsFirst,
                            this.sql._getSourceSql().getLimitSqlSyntax]))];
                    case 2: return [2 /*return*/, _c.sent()];
                }
            });
        });
    };
    ActualSQLEntityDataProvider.prototype.find = function (options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var e, _a, colKeys, select, r, where, _b, first, segs, _c, _d, s, segs_1, segs_1_1, c, page;
            var e_2, _e, e_3, _f;
            var _this = this;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, this.init()];
                    case 1:
                        e = _g.sent();
                        _a = this.buildSelect(e), colKeys = _a.colKeys, select = _a.select;
                        select = 'select ' + select;
                        select += '\n from ' + e.$entityName;
                        r = this.sql.createCommand();
                        if (!options) return [3 /*break*/, 4];
                        if (!options.where) return [3 /*break*/, 3];
                        where = new filter_consumer_bridge_to_sql_request_js_1.FilterConsumerBridgeToSqlRequest(r, e);
                        options.where.__applyToConsumer(where);
                        _b = select;
                        return [4 /*yield*/, where.resolveWhere()];
                    case 2:
                        select = _b + _g.sent();
                        _g.label = 3;
                    case 3:
                        if (options.limit) {
                            options.orderBy = sort_js_1.Sort.createUniqueSort(this.entity, options.orderBy);
                        }
                        if (!options.orderBy) {
                            options.orderBy = sort_js_1.Sort.createUniqueSort(this.entity, new sort_js_1.Sort());
                        }
                        if (options.orderBy) {
                            first = true;
                            segs = [];
                            try {
                                for (_c = tslib_1.__values(options.orderBy.Segments), _d = _c.next(); !_d.done; _d = _c.next()) {
                                    s = _d.value;
                                    segs.push(s);
                                }
                            }
                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                            finally {
                                try {
                                    if (_d && !_d.done && (_e = _c.return)) _e.call(_c);
                                }
                                finally { if (e_2) throw e_2.error; }
                            }
                            try {
                                for (segs_1 = tslib_1.__values(segs), segs_1_1 = segs_1.next(); !segs_1_1.done; segs_1_1 = segs_1.next()) {
                                    c = segs_1_1.value;
                                    if (first) {
                                        select += ' Order By ';
                                        first = false;
                                    }
                                    else
                                        select += ', ';
                                    select += e.$dbNameOf(c.field);
                                    if (c.isDescending)
                                        select += ' desc';
                                    if (this.sql._getSourceSql().orderByNullsFirst) {
                                        if (c.isDescending)
                                            select += ' nulls last';
                                        else
                                            select += ' nulls first';
                                    }
                                }
                            }
                            catch (e_3_1) { e_3 = { error: e_3_1 }; }
                            finally {
                                try {
                                    if (segs_1_1 && !segs_1_1.done && (_f = segs_1.return)) _f.call(segs_1);
                                }
                                finally { if (e_3) throw e_3.error; }
                            }
                        }
                        if (options.limit) {
                            page = 1;
                            if (options.page)
                                page = options.page;
                            if (page < 1)
                                page = 1;
                            select +=
                                ' ' +
                                    this.strategy.getLimitSqlSyntax(options.limit, (page - 1) * options.limit);
                        }
                        _g.label = 4;
                    case 4: return [2 /*return*/, r.execute(select).then(function (r) {
                            return r.rows.map(function (y) {
                                return _this.buildResultRow(colKeys, y, r);
                            });
                        })];
                }
            });
        });
    };
    ActualSQLEntityDataProvider.prototype.buildResultRow = function (colKeys, y, r) {
        var result = {};
        for (var index = 0; index < colKeys.length; index++) {
            var col = colKeys[index];
            try {
                result[col.key] = col.valueConverter.fromDb(y[r.getColumnKeyInResultForIndexInSelect(index)]);
            }
            catch (err) {
                throw new Error('Failed to load from db:' + col.key + '\r\n' + err);
            }
        }
        return result;
    };
    ActualSQLEntityDataProvider.prototype.buildSelect = function (e) {
        var e_4, _a;
        var select = '';
        var colKeys = [];
        try {
            for (var _b = tslib_1.__values(this.entity.fields), _c = _b.next(); !_c.done; _c = _b.next()) {
                var x = _c.value;
                if (x.isServerExpression) {
                }
                else {
                    if (colKeys.length > 0)
                        select += ', ';
                    select += e.$dbNameOf(x);
                    if (x.options.sqlExpression)
                        select += ' as ' + x.key;
                    colKeys.push(x);
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
        return { colKeys: colKeys, select: select };
    };
    ActualSQLEntityDataProvider.prototype.update = function (id, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var e, r, statement, added, _a, _b, x, v, idFilter, f, _c, _d, colKeys, select, returning;
            var e_5, _e;
            var _this = this;
            return tslib_1.__generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, this.init()];
                    case 1:
                        e = _f.sent();
                        r = this.sql.createCommand();
                        statement = 'update ' + e.$entityName + ' set ';
                        added = false;
                        try {
                            for (_a = tslib_1.__values(this.entity.fields), _b = _a.next(); !_b.done; _b = _a.next()) {
                                x = _b.value;
                                if ((0, filter_consumer_bridge_to_sql_request_js_1.isDbReadonly)(x, e)) {
                                }
                                else if (data[x.key] !== undefined) {
                                    v = x.valueConverter.toDb(data[x.key]);
                                    if (v !== undefined) {
                                        if (!added)
                                            added = true;
                                        else
                                            statement += ', ';
                                        statement += e.$dbNameOf(x) + ' = ' + r.param(v);
                                    }
                                }
                            }
                        }
                        catch (e_5_1) { e_5 = { error: e_5_1 }; }
                        finally {
                            try {
                                if (_b && !_b.done && (_e = _a.return)) _e.call(_a);
                            }
                            finally { if (e_5) throw e_5.error; }
                        }
                        idFilter = this.entity.idMetadata.getIdFilter(id);
                        f = new filter_consumer_bridge_to_sql_request_js_1.FilterConsumerBridgeToSqlRequest(r, e);
                        filter_interfaces_js_1.Filter.fromEntityFilter(this.entity, idFilter).__applyToConsumer(f);
                        _c = statement;
                        return [4 /*yield*/, f.resolveWhere()];
                    case 2:
                        statement = _c + _f.sent();
                        _d = this.buildSelect(e), colKeys = _d.colKeys, select = _d.select;
                        returning = true;
                        if (this.sql._getSourceSql().doesNotSupportReturningSyntax)
                            returning = false;
                        if (returning &&
                            this.sql._getSourceSql().doesNotSupportReturningSyntaxOnlyForUpdate)
                            returning = false;
                        if (returning)
                            statement += ' returning ' + select;
                        return [2 /*return*/, r.execute(statement).then(function (sqlResult) {
                                var _a, _b;
                                (_b = (_a = _this.sql._getSourceSql()).afterMutation) === null || _b === void 0 ? void 0 : _b.call(_a);
                                if (!returning) {
                                    return getRowAfterUpdate(_this.entity, _this, data, id, 'update');
                                }
                                if (sqlResult.rows.length != 1)
                                    throw new Error('Failed to update row with id ' +
                                        id +
                                        ', rows updated: ' +
                                        sqlResult.rows.length);
                                return _this.buildResultRow(colKeys, sqlResult.rows[0], sqlResult);
                            })];
                }
            });
        });
    };
    ActualSQLEntityDataProvider.prototype.delete = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var e, r, f, statement, _a;
            var _this = this;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.init()];
                    case 1:
                        e = _b.sent();
                        r = this.sql.createCommand();
                        f = new filter_consumer_bridge_to_sql_request_js_1.FilterConsumerBridgeToSqlRequest(r, e);
                        filter_interfaces_js_1.Filter.fromEntityFilter(this.entity, this.entity.idMetadata.getIdFilter(id)).__applyToConsumer(f);
                        statement = 'delete from ' + e.$entityName;
                        _a = statement;
                        return [4 /*yield*/, f.resolveWhere()];
                    case 2:
                        statement = _a + _b.sent();
                        return [2 /*return*/, r.execute(statement).then(function () {
                                var _a, _b;
                                (_b = (_a = _this.sql._getSourceSql()).afterMutation) === null || _b === void 0 ? void 0 : _b.call(_a);
                            })];
                }
            });
        });
    };
    ActualSQLEntityDataProvider.prototype.insert = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var e, r, cols, vals, added, _a, _b, x, v, statement, _c, colKeys, select;
            var e_6, _d;
            var _this = this;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.init()];
                    case 1:
                        e = _e.sent();
                        r = this.sql.createCommand();
                        cols = '';
                        vals = '';
                        added = false;
                        try {
                            for (_a = tslib_1.__values(this.entity.fields), _b = _a.next(); !_b.done; _b = _a.next()) {
                                x = _b.value;
                                if ((0, filter_consumer_bridge_to_sql_request_js_1.isDbReadonly)(x, e)) {
                                }
                                else {
                                    v = x.valueConverter.toDb(data[x.key]);
                                    if (v != undefined) {
                                        if (!added)
                                            added = true;
                                        else {
                                            cols += ', ';
                                            vals += ', ';
                                        }
                                        cols += e.$dbNameOf(x);
                                        vals += r.param(v);
                                    }
                                }
                            }
                        }
                        catch (e_6_1) { e_6 = { error: e_6_1 }; }
                        finally {
                            try {
                                if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                            }
                            finally { if (e_6) throw e_6.error; }
                        }
                        statement = "insert into ".concat(e.$entityName, " (").concat(cols, ") values (").concat(vals, ")");
                        _c = this.buildSelect(e), colKeys = _c.colKeys, select = _c.select;
                        if (!this.sql._getSourceSql().doesNotSupportReturningSyntax)
                            statement += ' returning ' + select;
                        return [4 /*yield*/, r.execute(statement).then(function (sql) {
                                var _a, _b;
                                (_b = (_a = _this.sql._getSourceSql()).afterMutation) === null || _b === void 0 ? void 0 : _b.call(_a);
                                if (_this.sql._getSourceSql().doesNotSupportReturningSyntax) {
                                    if ((0, RepositoryImplementation_js_1.isAutoIncrement)(_this.entity.idMetadata.field)) {
                                        var id_1 = sql.rows[0];
                                        if (typeof id_1 !== 'number')
                                            throw new Error('Auto increment, for a database that is does not support returning syntax, should return an array with the single last added id. Instead it returned: ' +
                                                JSON.stringify(id_1));
                                        return _this.find({
                                            where: new filter_interfaces_js_1.Filter(function (x) {
                                                return x.isEqualTo(_this.entity.idMetadata.field, id_1);
                                            }),
                                        }).then(function (r) { return r[0]; });
                                    }
                                    else {
                                        return getRowAfterUpdate(_this.entity, _this, data, undefined, 'insert');
                                    }
                                }
                                return _this.buildResultRow(colKeys, sql.rows[0], sql);
                            })];
                    case 2: return [2 /*return*/, _e.sent()];
                }
            });
        });
    };
    ActualSQLEntityDataProvider.LogToConsole = false;
    return ActualSQLEntityDataProvider;
}());
var myDummySQLCommand = /** @class */ (function () {
    function myDummySQLCommand() {
    }
    myDummySQLCommand.prototype.execute = function (sql) {
        throw new Error('Method not implemented.');
    };
    myDummySQLCommand.prototype.addParameterAndReturnSqlToken = function (val) {
        return this.param(val);
    };
    myDummySQLCommand.prototype.param = function (val) {
        if (val === null)
            return 'null';
        if (val instanceof Date)
            val = val.toISOString();
        if (typeof val == 'string') {
            if (val == undefined)
                val = '';
            return "'" + val.replace(/'/g, "''") + "'";
        }
        return val.toString();
    };
    return myDummySQLCommand;
}());
function getRowAfterUpdate(meta, dataProvider, data, id, operation) {
    var idFilter = id !== undefined ? meta.idMetadata.getIdFilter(id) : {};
    return dataProvider
        .find({
        where: new filter_interfaces_js_1.Filter(function (x) {
            var e_7, _a;
            var _b;
            try {
                for (var _c = tslib_1.__values(meta.idMetadata.fields), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var field = _d.value;
                    x.isEqualTo(field, (_b = data[field.key]) !== null && _b !== void 0 ? _b : idFilter[field.key]);
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_7) throw e_7.error; }
            }
        }),
    })
        .then(function (r) {
        if (r.length != 1)
            throw new Error("Failed to ".concat(operation, " row - result contained ").concat(r.length, " rows"));
        return r[0];
    });
}
function groupByImpl(options, e, r, orderByNullFirst, limitSyntax) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        function aggregateSqlSyntax(operator, dbName) {
            return operator === 'distinctCount'
                ? "count (distinct ".concat(dbName, ")")
                : "".concat(operator, "( ").concat(dbName, " )");
        }
        var select, groupBy, processResultRow, _loop_1, _a, _b, x, _loop_2, GroupByOperators_1, GroupByOperators_1_1, operator, e_8_1, where, _c, orderBy, _d, _e, x, field, _f, e_9_1, page, result;
        var e_10, _g, e_8, _h, e_9, _j;
        return tslib_1.__generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    select = 'select count(*) as count';
                    groupBy = '';
                    processResultRow = [];
                    processResultRow.push(function (sqlVal, theResult) {
                        theResult[remult3_js_1.GroupByCountMember] = Number(sqlVal);
                    });
                    if (options === null || options === void 0 ? void 0 : options.group) {
                        _loop_1 = function (x) {
                            if (x.isServerExpression) {
                            }
                            else {
                                select += ', ' + e.$dbNameOf(x);
                                if (x.options.sqlExpression)
                                    select += ' as ' + x.key;
                                if (groupBy == '')
                                    groupBy = ' group by ';
                                else
                                    groupBy += ', ';
                                groupBy += e.$dbNameOf(x);
                            }
                            processResultRow.push(function (sqlResult, theResult) {
                                theResult[x.key] = x.valueConverter.fromDb(sqlResult);
                            });
                        };
                        try {
                            for (_a = tslib_1.__values(options === null || options === void 0 ? void 0 : options.group), _b = _a.next(); !_b.done; _b = _a.next()) {
                                x = _b.value;
                                _loop_1(x);
                            }
                        }
                        catch (e_10_1) { e_10 = { error: e_10_1 }; }
                        finally {
                            try {
                                if (_b && !_b.done && (_g = _a.return)) _g.call(_a);
                            }
                            finally { if (e_10) throw e_10.error; }
                        }
                    }
                    _loop_2 = function (operator) {
                        var fields, _loop_3, fields_1, fields_1_1, x, e_11_1;
                        var e_11, _l;
                        return tslib_1.__generator(this, function (_m) {
                            switch (_m.label) {
                                case 0:
                                    fields = options === null || options === void 0 ? void 0 : options[operator];
                                    if (!fields) return [3 /*break*/, 8];
                                    _loop_3 = function (x) {
                                        var dbName, turnToNumber;
                                        return tslib_1.__generator(this, function (_o) {
                                            switch (_o.label) {
                                                case 0:
                                                    if (!x.isServerExpression) return [3 /*break*/, 1];
                                                    return [3 /*break*/, 3];
                                                case 1: return [4 /*yield*/, e.$dbNameOf(x)];
                                                case 2:
                                                    dbName = _o.sent();
                                                    select += ", ".concat(aggregateSqlSyntax(operator, dbName), " as ").concat(x.key, "_").concat(operator);
                                                    _o.label = 3;
                                                case 3:
                                                    turnToNumber = x.valueType === Number || operator == 'distinctCount';
                                                    processResultRow.push(function (sqlResult, theResult) {
                                                        var _a;
                                                        if (turnToNumber)
                                                            sqlResult = Number(sqlResult);
                                                        theResult[x.key] = tslib_1.__assign(tslib_1.__assign({}, theResult[x.key]), (_a = {}, _a[operator] = sqlResult, _a));
                                                    });
                                                    return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _m.label = 1;
                                case 1:
                                    _m.trys.push([1, 6, 7, 8]);
                                    fields_1 = (e_11 = void 0, tslib_1.__values(fields)), fields_1_1 = fields_1.next();
                                    _m.label = 2;
                                case 2:
                                    if (!!fields_1_1.done) return [3 /*break*/, 5];
                                    x = fields_1_1.value;
                                    return [5 /*yield**/, _loop_3(x)];
                                case 3:
                                    _m.sent();
                                    _m.label = 4;
                                case 4:
                                    fields_1_1 = fields_1.next();
                                    return [3 /*break*/, 2];
                                case 5: return [3 /*break*/, 8];
                                case 6:
                                    e_11_1 = _m.sent();
                                    e_11 = { error: e_11_1 };
                                    return [3 /*break*/, 8];
                                case 7:
                                    try {
                                        if (fields_1_1 && !fields_1_1.done && (_l = fields_1.return)) _l.call(fields_1);
                                    }
                                    finally { if (e_11) throw e_11.error; }
                                    return [7 /*endfinally*/];
                                case 8: return [2 /*return*/];
                            }
                        });
                    };
                    _k.label = 1;
                case 1:
                    _k.trys.push([1, 6, 7, 8]);
                    GroupByOperators_1 = tslib_1.__values(remult3_js_1.GroupByOperators), GroupByOperators_1_1 = GroupByOperators_1.next();
                    _k.label = 2;
                case 2:
                    if (!!GroupByOperators_1_1.done) return [3 /*break*/, 5];
                    operator = GroupByOperators_1_1.value;
                    return [5 /*yield**/, _loop_2(operator)];
                case 3:
                    _k.sent();
                    _k.label = 4;
                case 4:
                    GroupByOperators_1_1 = GroupByOperators_1.next();
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 8];
                case 6:
                    e_8_1 = _k.sent();
                    e_8 = { error: e_8_1 };
                    return [3 /*break*/, 8];
                case 7:
                    try {
                        if (GroupByOperators_1_1 && !GroupByOperators_1_1.done && (_h = GroupByOperators_1.return)) _h.call(GroupByOperators_1);
                    }
                    finally { if (e_8) throw e_8.error; }
                    return [7 /*endfinally*/];
                case 8:
                    select += '\n from ' + e.$entityName;
                    if (!(options === null || options === void 0 ? void 0 : options.where)) return [3 /*break*/, 10];
                    where = new filter_consumer_bridge_to_sql_request_js_1.FilterConsumerBridgeToSqlRequest(r, e);
                    options === null || options === void 0 ? void 0 : options.where.__applyToConsumer(where);
                    _c = select;
                    return [4 /*yield*/, where.resolveWhere()];
                case 9:
                    select = _c + _k.sent();
                    _k.label = 10;
                case 10:
                    if (groupBy)
                        select += groupBy;
                    orderBy = '';
                    if (!(options === null || options === void 0 ? void 0 : options.orderBy)) return [3 /*break*/, 20];
                    _k.label = 11;
                case 11:
                    _k.trys.push([11, 17, 18, 19]);
                    _d = tslib_1.__values(options === null || options === void 0 ? void 0 : options.orderBy), _e = _d.next();
                    _k.label = 12;
                case 12:
                    if (!!_e.done) return [3 /*break*/, 16];
                    x = _e.value;
                    if (orderBy == '')
                        orderBy = ' order by ';
                    else
                        orderBy += ', ';
                    _f = x.field;
                    if (!_f) return [3 /*break*/, 14];
                    return [4 /*yield*/, e.$dbNameOf(x.field)];
                case 13:
                    _f = (_k.sent());
                    _k.label = 14;
                case 14:
                    field = _f;
                    switch (x.operation) {
                        case 'count':
                            field = x.operation + '(*)';
                            break;
                        case undefined:
                            break;
                        default:
                            field = aggregateSqlSyntax(x.operation, field);
                    }
                    orderBy += field;
                    if (x.isDescending)
                        orderBy += ' desc';
                    if (orderByNullFirst) {
                        if (x.isDescending)
                            orderBy += ' nulls last';
                        else
                            orderBy += ' nulls first';
                    }
                    _k.label = 15;
                case 15:
                    _e = _d.next();
                    return [3 /*break*/, 12];
                case 16: return [3 /*break*/, 19];
                case 17:
                    e_9_1 = _k.sent();
                    e_9 = { error: e_9_1 };
                    return [3 /*break*/, 19];
                case 18:
                    try {
                        if (_e && !_e.done && (_j = _d.return)) _j.call(_d);
                    }
                    finally { if (e_9) throw e_9.error; }
                    return [7 /*endfinally*/];
                case 19:
                    if (orderBy)
                        select += orderBy;
                    _k.label = 20;
                case 20:
                    if (options === null || options === void 0 ? void 0 : options.limit) {
                        page = 1;
                        if (options.page)
                            page = options.page;
                        if (page < 1)
                            page = 1;
                        select += ' ' + limitSyntax(options.limit, (page - 1) * options.limit);
                    }
                    return [4 /*yield*/, r.execute(select)];
                case 21:
                    result = _k.sent();
                    return [2 /*return*/, result.rows.map(function (sql) {
                            var theResult = {};
                            processResultRow.forEach(function (x, i) {
                                return x(sql[result.getColumnKeyInResultForIndexInSelect(i)], theResult);
                            });
                            return theResult;
                        })];
            }
        });
    });
}
