"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDataProvider = void 0;
var tslib_1 = require("tslib");
var mongodb_1 = require("mongodb");
var index_js_1 = require("./index.js");
var filter_consumer_bridge_to_sql_request_js_1 = require("./src/filter/filter-consumer-bridge-to-sql-request.js");
var remult_proxy_js_1 = require("./src/remult-proxy.js");
var RepositoryImplementation_js_1 = require("./src/remult3/RepositoryImplementation.js");
var repository_internals_js_1 = require("./src/remult3/repository-internals.js");
var sql_database_js_1 = require("./src/data-providers/sql-database.js");
var remult3_js_1 = require("./src/remult3/remult3.js");
var MongoDataProvider = /** @class */ (function () {
    function MongoDataProvider(db, client, options) {
        this.db = db;
        this.client = client;
        this.disableTransactions = false;
        this.session = options === null || options === void 0 ? void 0 : options.session;
        this.disableTransactions = Boolean(options === null || options === void 0 ? void 0 : options.disableTransactions);
    }
    MongoDataProvider.getDb = function (dataProvider) {
        var r = (dataProvider || remult_proxy_js_1.remult.dataProvider);
        if (!r.db)
            throw 'the data provider is not a MongoDataProvider';
        return { db: r.db, session: r.session };
    };
    MongoDataProvider.prototype.ensureSchema = function (entities) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var entities_1, entities_1_1, entity, m, e_1_1;
            var e_1, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, 6, 7]);
                        entities_1 = tslib_1.__values(entities), entities_1_1 = entities_1.next();
                        _b.label = 1;
                    case 1:
                        if (!!entities_1_1.done) return [3 /*break*/, 4];
                        entity = entities_1_1.value;
                        m = new MongoEntityDataProvider(this.db, entity, this.session);
                        return [4 /*yield*/, m.ensureSchema()];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        entities_1_1 = entities_1.next();
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 7];
                    case 6:
                        try {
                            if (entities_1_1 && !entities_1_1.done && (_a = entities_1.return)) _a.call(entities_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    MongoDataProvider.prototype.getEntityDataProvider = function (entity) {
        return new MongoEntityDataProvider(this.db, entity, this.session);
    };
    MongoDataProvider.prototype.transaction = function (action) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var session, db, err_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.disableTransactions) return [3 /*break*/, 2];
                        return [4 /*yield*/, action(this)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 11];
                    case 2:
                        if (!this.client)
                            throw new Error("Can't use transactions within transactions");
                        return [4 /*yield*/, this.client.startSession()];
                    case 3:
                        session = _a.sent();
                        session.startTransaction();
                        db = this.client.db(this.db.databaseName);
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 7, 9, 11]);
                        return [4 /*yield*/, action(new MongoDataProvider(db, undefined, { session: session }))];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, session.commitTransaction()];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 11];
                    case 7:
                        err_1 = _a.sent();
                        return [4 /*yield*/, session.abortTransaction()];
                    case 8:
                        _a.sent();
                        throw err_1;
                    case 9: return [4 /*yield*/, session.endSession()];
                    case 10:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    MongoDataProvider.filterToRaw = function (entity, condition) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var repo, b, _a, r;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        repo = (0, RepositoryImplementation_js_1.getRepository)(entity);
                        _a = FilterConsumerBridgeToMongo.bind;
                        return [4 /*yield*/, (0, filter_consumer_bridge_to_sql_request_js_1.dbNamesOfWithForceSqlExpression)(repo.metadata)];
                    case 1:
                        b = new (_a.apply(FilterConsumerBridgeToMongo, [void 0, _b.sent()]))();
                        b._addWhere = false;
                        return [4 /*yield*/, (0, repository_internals_js_1.getRepositoryInternals)(repo)._translateWhereToFilter(condition)];
                    case 2: return [4 /*yield*/, (_b.sent()).__applyToConsumer(b)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, b.resolveWhere()];
                    case 4:
                        r = _b.sent();
                        return [2 /*return*/, r];
                }
            });
        });
    };
    return MongoDataProvider;
}());
exports.MongoDataProvider = MongoDataProvider;
var NULL = { $null: '$null' };
function isNull(x) {
    return (x === null || x === void 0 ? void 0 : x.$null) === NULL.$null;
}
var MongoEntityDataProvider = /** @class */ (function () {
    function MongoEntityDataProvider(db, entity, session) {
        this.db = db;
        this.entity = entity;
        this.session = session;
    }
    MongoEntityDataProvider.prototype.ensureSchema = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, collection, e, index, _b, _c, f, err_2;
            var e_2, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.collection()];
                    case 1:
                        _a = _e.sent(), collection = _a.collection, e = _a.e;
                        return [4 /*yield*/, this.db.collections()];
                    case 2:
                        if (!!(_e.sent()).find(function (x) { return x.collectionName == e.$entityName; })) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.db.createCollection(e.$entityName)];
                    case 3:
                        _e.sent();
                        if (!(this.entity.idMetadata.field &&
                            e.$dbNameOf(this.entity.idMetadata.field) != '_id')) return [3 /*break*/, 7];
                        index = {};
                        try {
                            for (_b = tslib_1.__values(this.entity.idMetadata.fields), _c = _b.next(); !_c.done; _c = _b.next()) {
                                f = _c.value;
                                index[e.$dbNameOf(f)] = 1;
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (_c && !_c.done && (_d = _b.return)) _d.call(_b);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        _e.label = 4;
                    case 4:
                        _e.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, collection.createIndex(index, { unique: true })];
                    case 5:
                        _e.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        err_2 = _e.sent();
                        throw err_2;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    MongoEntityDataProvider.prototype.translateFromDb = function (row, nameProvider) {
        var e_3, _a;
        var result = {};
        try {
            for (var _b = tslib_1.__values(this.entity.fields), _c = _b.next(); !_c.done; _c = _b.next()) {
                var col = _c.value;
                var val = row[nameProvider.$dbNameOf(col)];
                if (val === undefined) {
                    if (!col.allowNull) {
                        if (col.valueType === String)
                            val = '';
                    }
                    else
                        val = null;
                }
                if (isNull(val))
                    val = null;
                result[col.key] = fromDb(col, val);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return result;
    };
    MongoEntityDataProvider.prototype.translateToDb = function (row, nameProvider) {
        var e_4, _a;
        var result = {};
        try {
            for (var _b = tslib_1.__values(this.entity.fields), _c = _b.next(); !_c.done; _c = _b.next()) {
                var col = _c.value;
                var val = toDb(col, row[col.key]);
                if (val === null)
                    val = NULL;
                result[nameProvider.$dbNameOf(col)] = val;
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return result;
    };
    MongoEntityDataProvider.prototype.count = function (where) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, collection, e, x, w;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.collection()];
                    case 1:
                        _a = _b.sent(), collection = _a.collection, e = _a.e;
                        x = new FilterConsumerBridgeToMongo(e);
                        where.__applyToConsumer(x);
                        return [4 /*yield*/, x.resolveWhere()];
                    case 2:
                        w = _b.sent();
                        return [4 /*yield*/, collection.countDocuments(w, { session: this.session })];
                    case 3: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    MongoEntityDataProvider.prototype.groupBy = function (options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, collection, e, x, pipeLine, where, processResultRow, $group, $addFields, _loop_1, _b, _c, element, _loop_2, GroupByOperators_1, GroupByOperators_1_1, operator, sort, _d, _e, x_1, direction, r, r2;
            var e_5, _f, e_6, _g, e_7, _h;
            return tslib_1.__generator(this, function (_j) {
                switch (_j.label) {
                    case 0: return [4 /*yield*/, this.collection()];
                    case 1:
                        _a = _j.sent(), collection = _a.collection, e = _a.e;
                        x = new FilterConsumerBridgeToMongo(e);
                        pipeLine = [];
                        if (!(options === null || options === void 0 ? void 0 : options.where)) return [3 /*break*/, 3];
                        options.where.__applyToConsumer(x);
                        return [4 /*yield*/, x.resolveWhere()];
                    case 2:
                        where = _j.sent();
                        pipeLine.push({ $match: where });
                        _j.label = 3;
                    case 3:
                        processResultRow = [];
                        $group = {
                            __count: { $sum: 1 },
                        };
                        processResultRow.push(function (mongoRow, resultRow) {
                            resultRow[remult3_js_1.GroupByCountMember] = mongoRow.__count;
                        });
                        pipeLine.push({ $group: $group });
                        $addFields = {};
                        pipeLine.push({ $addFields: $addFields });
                        if (options === null || options === void 0 ? void 0 : options.group) {
                            $group._id = {};
                            _loop_1 = function (element) {
                                var name_1 = e.$dbNameOf(element);
                                $group._id[name_1] = "$".concat(name_1);
                                processResultRow.push(function (mongoRow, resultRow) {
                                    resultRow[element.key] = element.valueConverter.fromDb(mongoRow._id[name_1]);
                                });
                            };
                            try {
                                for (_b = tslib_1.__values(options.group), _c = _b.next(); !_c.done; _c = _b.next()) {
                                    element = _c.value;
                                    _loop_1(element);
                                }
                            }
                            catch (e_5_1) { e_5 = { error: e_5_1 }; }
                            finally {
                                try {
                                    if (_c && !_c.done && (_f = _b.return)) _f.call(_b);
                                }
                                finally { if (e_5) throw e_5.error; }
                            }
                        }
                        else {
                            $group._id = null;
                        }
                        _loop_2 = function (operator) {
                            var e_8, _k;
                            if (options === null || options === void 0 ? void 0 : options[operator]) {
                                var _loop_3 = function (element) {
                                    var _o;
                                    var name_2 = e.$dbNameOf(element) + '_' + operator;
                                    if (operator === 'distinctCount') {
                                        $group[name_2 + '_temp'] = { $addToSet: "$".concat(e.$dbNameOf(element)) };
                                        $addFields[name_2] = { $size: "$".concat(name_2 + '_temp') };
                                    }
                                    else
                                        $group[name_2] = (_o = {}, _o['$' + operator] = "$".concat(e.$dbNameOf(element)), _o);
                                    processResultRow.push(function (mongoRow, resultRow) {
                                        var _a;
                                        resultRow[element.key] = tslib_1.__assign(tslib_1.__assign({}, resultRow[element.key]), (_a = {}, _a[operator] = mongoRow[name_2], _a));
                                    });
                                };
                                try {
                                    for (var _l = (e_8 = void 0, tslib_1.__values(options[operator])), _m = _l.next(); !_m.done; _m = _l.next()) {
                                        var element = _m.value;
                                        _loop_3(element);
                                    }
                                }
                                catch (e_8_1) { e_8 = { error: e_8_1 }; }
                                finally {
                                    try {
                                        if (_m && !_m.done && (_k = _l.return)) _k.call(_l);
                                    }
                                    finally { if (e_8) throw e_8.error; }
                                }
                            }
                        };
                        try {
                            for (GroupByOperators_1 = tslib_1.__values(remult3_js_1.GroupByOperators), GroupByOperators_1_1 = GroupByOperators_1.next(); !GroupByOperators_1_1.done; GroupByOperators_1_1 = GroupByOperators_1.next()) {
                                operator = GroupByOperators_1_1.value;
                                _loop_2(operator);
                            }
                        }
                        catch (e_6_1) { e_6 = { error: e_6_1 }; }
                        finally {
                            try {
                                if (GroupByOperators_1_1 && !GroupByOperators_1_1.done && (_g = GroupByOperators_1.return)) _g.call(GroupByOperators_1);
                            }
                            finally { if (e_6) throw e_6.error; }
                        }
                        if (options === null || options === void 0 ? void 0 : options.orderBy) {
                            sort = {};
                            try {
                                for (_d = tslib_1.__values(options.orderBy), _e = _d.next(); !_e.done; _e = _d.next()) {
                                    x_1 = _e.value;
                                    direction = x_1.isDescending ? -1 : 1;
                                    switch (x_1.operation) {
                                        case 'count':
                                            sort['__count'] = direction;
                                            break;
                                        case undefined:
                                            sort['_id.' + e.$dbNameOf(x_1.field)] = direction;
                                            break;
                                        default:
                                            sort[e.$dbNameOf(x_1.field) + '_' + x_1.operation] = direction;
                                            break;
                                    }
                                }
                            }
                            catch (e_7_1) { e_7 = { error: e_7_1 }; }
                            finally {
                                try {
                                    if (_e && !_e.done && (_h = _d.return)) _h.call(_d);
                                }
                                finally { if (e_7) throw e_7.error; }
                            }
                            pipeLine.push({ $sort: sort });
                        }
                        if (options === null || options === void 0 ? void 0 : options.limit) {
                            pipeLine.push({ $limit: options.limit });
                            if (options.page) {
                                pipeLine.push({ $skip: (options.page - 1) * options.limit });
                            }
                        }
                        return [4 /*yield*/, collection
                                .aggregate(pipeLine, { session: this.session })
                                .toArray()];
                    case 4:
                        r = _j.sent();
                        r2 = r.map(function (x) {
                            var e_9, _a;
                            var resultRow = {};
                            try {
                                for (var processResultRow_1 = tslib_1.__values(processResultRow), processResultRow_1_1 = processResultRow_1.next(); !processResultRow_1_1.done; processResultRow_1_1 = processResultRow_1.next()) {
                                    var f = processResultRow_1_1.value;
                                    f(x, resultRow);
                                }
                            }
                            catch (e_9_1) { e_9 = { error: e_9_1 }; }
                            finally {
                                try {
                                    if (processResultRow_1_1 && !processResultRow_1_1.done && (_a = processResultRow_1.return)) _a.call(processResultRow_1);
                                }
                                finally { if (e_9) throw e_9.error; }
                            }
                            return resultRow;
                        });
                        return [2 /*return*/, r2];
                }
            });
        });
    };
    MongoEntityDataProvider.prototype.find = function (options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, collection, e, x, where, op, _b, _c, s, _d, _e;
            var e_10, _f;
            var _this = this;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, this.collection()];
                    case 1:
                        _a = _g.sent(), collection = _a.collection, e = _a.e;
                        x = new FilterConsumerBridgeToMongo(e);
                        if (options === null || options === void 0 ? void 0 : options.where)
                            options.where.__applyToConsumer(x);
                        return [4 /*yield*/, x.resolveWhere()];
                    case 2:
                        where = _g.sent();
                        op = {
                            session: this.session,
                        };
                        if (options.limit) {
                            op.limit = options.limit;
                            if (options.page) {
                                op.skip = (options.page - 1) * options.limit;
                            }
                        }
                        if (options.orderBy) {
                            op.sort = {};
                            try {
                                for (_b = tslib_1.__values(options.orderBy.Segments), _c = _b.next(); !_c.done; _c = _b.next()) {
                                    s = _c.value;
                                    op.sort[e.$dbNameOf(s.field)] = s.isDescending ? -1 : 1;
                                }
                            }
                            catch (e_10_1) { e_10 = { error: e_10_1 }; }
                            finally {
                                try {
                                    if (_c && !_c.done && (_f = _b.return)) _f.call(_b);
                                }
                                finally { if (e_10) throw e_10.error; }
                            }
                        }
                        _e = (_d = Promise).all;
                        return [4 /*yield*/, collection
                                .find(where, op)
                                .map(function (x) { return _this.translateFromDb(x, e); })
                                .toArray()];
                    case 3: return [4 /*yield*/, _e.apply(_d, [_g.sent()])];
                    case 4: return [2 /*return*/, _g.sent()];
                }
            });
        });
    };
    MongoEntityDataProvider.prototype.update = function (id, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, collection, e, f, newR, keys, _b, _c, f_1, r, _d, _e;
            var e_11, _f;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, this.collection()];
                    case 1:
                        _a = _g.sent(), collection = _a.collection, e = _a.e;
                        f = new FilterConsumerBridgeToMongo(e);
                        index_js_1.Filter.fromEntityFilter(this.entity, this.entity.idMetadata.getIdFilter(id)).__applyToConsumer(f);
                        newR = {};
                        keys = Object.keys(data);
                        try {
                            for (_b = tslib_1.__values(this.entity.fields), _c = _b.next(); !_c.done; _c = _b.next()) {
                                f_1 = _c.value;
                                if (!f_1.dbReadOnly && !f_1.isServerExpression) {
                                    if (keys.includes(f_1.key)) {
                                        newR[f_1.key] = toDb(f_1, data[f_1.key]);
                                    }
                                }
                            }
                        }
                        catch (e_11_1) { e_11 = { error: e_11_1 }; }
                        finally {
                            try {
                                if (_c && !_c.done && (_f = _b.return)) _f.call(_b);
                            }
                            finally { if (e_11) throw e_11.error; }
                        }
                        _e = (_d = collection).updateOne;
                        return [4 /*yield*/, f.resolveWhere()];
                    case 2: return [4 /*yield*/, _e.apply(_d, [_g.sent(), {
                                $set: newR,
                            },
                            { session: this.session }])];
                    case 3:
                        r = _g.sent();
                        return [2 /*return*/, (0, sql_database_js_1.getRowAfterUpdate)(this.entity, this, data, id, 'update')];
                }
            });
        });
    };
    MongoEntityDataProvider.prototype.delete = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, e, collection, f, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.collection()];
                    case 1:
                        _a = _d.sent(), e = _a.e, collection = _a.collection;
                        f = new FilterConsumerBridgeToMongo(e);
                        index_js_1.Filter.fromEntityFilter(this.entity, this.entity.idMetadata.getIdFilter(id)).__applyToConsumer(f);
                        _c = (_b = collection).deleteOne;
                        return [4 /*yield*/, f.resolveWhere()];
                    case 2: return [4 /*yield*/, _c.apply(_b, [_d.sent(), {
                                session: this.session,
                            }])];
                    case 3:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MongoEntityDataProvider.prototype.insert = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, collection, e, r, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.collection()];
                    case 1:
                        _a = _e.sent(), collection = _a.collection, e = _a.e;
                        _c = (_b = collection).insertOne;
                        return [4 /*yield*/, this.translateToDb(data, e)];
                    case 2: return [4 /*yield*/, _c.apply(_b, [_e.sent(), {
                                session: this.session,
                            }])];
                    case 3:
                        r = _e.sent();
                        _d = this.translateFromDb;
                        return [4 /*yield*/, collection.findOne({ _id: r.insertedId }, { session: this.session })];
                    case 4: return [4 /*yield*/, _d.apply(this, [_e.sent(), e])];
                    case 5: return [2 /*return*/, _e.sent()];
                }
            });
        });
    };
    MongoEntityDataProvider.prototype.collection = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var e, collection;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, filter_consumer_bridge_to_sql_request_js_1.dbNamesOf)(this.entity)];
                    case 1:
                        e = _a.sent();
                        collection = this.db.collection(e.$entityName);
                        return [2 /*return*/, { e: e, collection: collection }];
                }
            });
        });
    };
    return MongoEntityDataProvider;
}());
var FilterConsumerBridgeToMongo = /** @class */ (function () {
    function FilterConsumerBridgeToMongo(nameProvider) {
        this.nameProvider = nameProvider;
        this._addWhere = true;
        this.promises = [];
        this.result = [];
    }
    FilterConsumerBridgeToMongo.prototype.resolveWhere = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var p, p_1, p_1_1, pr, e_12_1;
            var e_12, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.promises.length > 0)) return [3 /*break*/, 9];
                        p = this.promises;
                        this.promises = [];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, 7, 8]);
                        p_1 = (e_12 = void 0, tslib_1.__values(p)), p_1_1 = p_1.next();
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
                        e_12_1 = _b.sent();
                        e_12 = { error: e_12_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (p_1_1 && !p_1_1.done && (_a = p_1.return)) _a.call(p_1);
                        }
                        finally { if (e_12) throw e_12.error; }
                        return [7 /*endfinally*/];
                    case 8: return [3 /*break*/, 0];
                    case 9:
                        if (this.result.length > 0)
                            return [2 /*return*/, { $and: this.result.map(function (x) { return x(); }) }];
                        else
                            return [2 /*return*/, {}];
                        return [2 /*return*/];
                }
            });
        });
    };
    FilterConsumerBridgeToMongo.prototype.custom = function (key, customItem) {
        throw new Error('Custom filter should be translated before it gets here');
    };
    FilterConsumerBridgeToMongo.prototype.or = function (orElements) {
        var _this = this;
        this.promises.push((function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var result, orElements_1, orElements_1_1, element, f, where, e_13_1;
            var e_13, _a;
            var _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        result = [];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 6, 7, 8]);
                        orElements_1 = tslib_1.__values(orElements), orElements_1_1 = orElements_1.next();
                        _c.label = 2;
                    case 2:
                        if (!!orElements_1_1.done) return [3 /*break*/, 5];
                        element = orElements_1_1.value;
                        f = new FilterConsumerBridgeToMongo(this.nameProvider);
                        f._addWhere = false;
                        element.__applyToConsumer(f);
                        return [4 /*yield*/, f.resolveWhere()];
                    case 3:
                        where = _c.sent();
                        if ((_b = where === null || where === void 0 ? void 0 : where.$and) === null || _b === void 0 ? void 0 : _b.length) {
                            result.push(where);
                        }
                        else
                            return [2 /*return*/]; //since empty or is all rows;
                        _c.label = 4;
                    case 4:
                        orElements_1_1 = orElements_1.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_13_1 = _c.sent();
                        e_13 = { error: e_13_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (orElements_1_1 && !orElements_1_1.done && (_a = orElements_1.return)) _a.call(orElements_1);
                        }
                        finally { if (e_13) throw e_13.error; }
                        return [7 /*endfinally*/];
                    case 8:
                        this.result.push(function () { return ({
                            $or: result,
                        }); });
                        return [2 /*return*/];
                }
            });
        }); })());
    };
    FilterConsumerBridgeToMongo.prototype.not = function (element) {
        var _this = this;
        this.promises.push((function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var f, where;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        f = new FilterConsumerBridgeToMongo(this.nameProvider);
                        f._addWhere = false;
                        element.__applyToConsumer(f);
                        return [4 /*yield*/, f.resolveWhere()];
                    case 1:
                        where = _a.sent();
                        if (where) {
                            this.result.push(function () { return ({
                                $nor: [where],
                            }); });
                        }
                        return [2 /*return*/];
                }
            });
        }); })());
    };
    FilterConsumerBridgeToMongo.prototype.isNull = function (col) {
        this.add(col, NULL, '$eq');
    };
    FilterConsumerBridgeToMongo.prototype.isNotNull = function (col) {
        this.add(col, NULL, '$ne');
    };
    FilterConsumerBridgeToMongo.prototype.isIn = function (col, val) {
        var _this = this;
        this.result.push(function () {
            var _a;
            return (_a = {},
                _a[_this.nameProvider.$dbNameOf(col)] = {
                    $in: val.map(function (x) { return toDb(col, x); }),
                },
                _a);
        });
    };
    FilterConsumerBridgeToMongo.prototype.isEqualTo = function (col, val) {
        this.add(col, val, '$eq');
    };
    FilterConsumerBridgeToMongo.prototype.isDifferentFrom = function (col, val) {
        this.add(col, val, '$ne');
    };
    FilterConsumerBridgeToMongo.prototype.isGreaterOrEqualTo = function (col, val) {
        this.add(col, val, '$gte');
    };
    FilterConsumerBridgeToMongo.prototype.isGreaterThan = function (col, val) {
        this.add(col, val, '$gt');
    };
    FilterConsumerBridgeToMongo.prototype.isLessOrEqualTo = function (col, val) {
        this.add(col, val, '$lte');
    };
    FilterConsumerBridgeToMongo.prototype.isLessThan = function (col, val) {
        this.add(col, val, '$lt');
    };
    FilterConsumerBridgeToMongo.prototype.containsCaseInsensitive = function (col, val) {
        this.add(col, val, '$regex', { $options: 'i' });
    };
    FilterConsumerBridgeToMongo.prototype.notContainsCaseInsensitive = function (col, val) {
        var _this = this;
        this.result.push(function () {
            var _a;
            return (_a = {},
                _a[_this.nameProvider.$dbNameOf(col)] = {
                    $not: {
                        $regex: isNull(val) ? val : toDb(col, val),
                        $options: 'i',
                    },
                },
                _a);
        });
    };
    FilterConsumerBridgeToMongo.prototype.startsWithCaseInsensitive = function (col, val) {
        this.add(col, "^".concat(val), '$regex', { $options: 'i' });
    };
    FilterConsumerBridgeToMongo.prototype.endsWithCaseInsensitive = function (col, val) {
        this.add(col, "".concat(val, "$"), '$regex', { $options: 'i' });
    };
    FilterConsumerBridgeToMongo.prototype.add = function (col, val, operator, moreOptions) {
        var _this = this;
        this.result.push(function () {
            var _a, _b;
            return (_a = {},
                _a[_this.nameProvider.$dbNameOf(col)] = tslib_1.__assign((_b = {}, _b[operator] = isNull(val) ? val : toDb(col, val), _b), moreOptions),
                _a);
        });
    };
    FilterConsumerBridgeToMongo.prototype.databaseCustom = function (databaseCustom) {
        throw 'error';
        //   this.promises.push((async () => {
        //     if (databaseCustom?.buildSql) {
        //       let item = new CustomSqlFilterBuilder(this.knex);
        //       await databaseCustom.buildSql(item);
        //       if (item.sql) {
        //         this.addToWhere("(" + item.sql + ")");
        //       }
        //     }
        //   })());
    };
    return FilterConsumerBridgeToMongo;
}());
function toDb(col, val) {
    if (col.valueConverter.fieldTypeInDb == 'dbid')
        return val ? new mongodb_1.ObjectId(val) : val === null ? null : undefined;
    return col.valueConverter.toDb(val);
}
function fromDb(col, val) {
    if (col.valueConverter.fieldTypeInDb == 'dbid')
        return val ? val.toHexString() : val === null ? null : undefined;
    return col.valueConverter.fromDb(val);
}
