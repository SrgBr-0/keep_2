"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveQueryStorageEntity = exports.DataProviderLiveQueryStorage = void 0;
var tslib_1 = require("tslib");
var context_js_1 = require("../src/context.js");
var RepositoryImplementation_js_1 = require("../src/remult3/RepositoryImplementation.js");
var Fields_js_1 = require("../src/remult3/Fields.js");
var entity_js_1 = require("../src/remult3/entity.js");
var initDataProviderOrJson_js_1 = require("../server/initDataProviderOrJson.js");
var DataProviderLiveQueryStorage = /** @class */ (function () {
    function DataProviderLiveQueryStorage(dataProvider) {
        this.dataProvider = (0, initDataProviderOrJson_js_1.initDataProviderOrJson)(dataProvider);
        this.repo = this.dataProvider.then(function (dp) {
            return new context_js_1.Remult(dp).repo(LiveQueryStorageEntity);
        });
    }
    DataProviderLiveQueryStorage.prototype.ensureSchema = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var dp, _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.dataProvider];
                    case 1:
                        dp = _c.sent();
                        if (!dp.ensureSchema) return [3 /*break*/, 4];
                        _b = (_a = dp).ensureSchema;
                        return [4 /*yield*/, this.repo];
                    case 2: return [4 /*yield*/, _b.apply(_a, [[(_c.sent()).metadata]])];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DataProviderLiveQueryStorage.prototype.add = function (_a) {
        return tslib_1.__awaiter(this, arguments, void 0, function (_b) {
            var _this = this;
            var id = _b.id, entityKey = _b.entityKey, data = _b.data;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.repo.then(function (repo) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var q;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, repo.findId(id, { createIfNotFound: true })];
                                    case 1:
                                        q = _a.sent();
                                        return [4 /*yield*/, q.assign({ entityKey: entityKey, data: data }).save()];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataProviderLiveQueryStorage.prototype.remove = function (queryId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repo
                            .then(function (repo) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var r;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, repo.findId(queryId)];
                                    case 1:
                                        r = _a.sent();
                                        if (!r) return [3 /*break*/, 3];
                                        return [4 /*yield*/, repo.delete(r)];
                                    case 2:
                                        _a.sent();
                                        _a.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); })
                            .catch(function () { })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataProviderLiveQueryStorage.prototype.forEach = function (entityKey, callback) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var repo, d, iso, _loop_1, _a, _b, query, e_1_1;
            var e_1, _c;
            var _this = this;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.repo];
                    case 1:
                        repo = _d.sent();
                        d = new Date();
                        d.setMinutes(d.getMinutes() - 5);
                        iso = d.toISOString();
                        _loop_1 = function (query) {
                            return tslib_1.__generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0:
                                        if (!(query.lastUsedIso < iso)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, repo.delete(query)];
                                    case 1:
                                        _e.sent();
                                        return [3 /*break*/, 4];
                                    case 2: return [4 /*yield*/, callback({
                                            query: query,
                                            setData: function (data) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                                return tslib_1.__generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            query.data = data;
                                                            return [4 /*yield*/, repo.save(query)];
                                                        case 1:
                                                            _a.sent();
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            }); },
                                        })];
                                    case 3:
                                        _e.sent();
                                        _e.label = 4;
                                    case 4: return [2 /*return*/];
                                }
                            });
                        };
                        _d.label = 2;
                    case 2:
                        _d.trys.push([2, 8, 9, 10]);
                        return [4 /*yield*/, repo.find({ where: { entityKey: entityKey } })];
                    case 3:
                        _a = tslib_1.__values.apply(void 0, [_d.sent()]), _b = _a.next();
                        _d.label = 4;
                    case 4:
                        if (!!_b.done) return [3 /*break*/, 7];
                        query = _b.value;
                        return [5 /*yield**/, _loop_1(query)];
                    case 5:
                        _d.sent();
                        _d.label = 6;
                    case 6:
                        _b = _a.next();
                        return [3 /*break*/, 4];
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        e_1_1 = _d.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 10];
                    case 9:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    DataProviderLiveQueryStorage.prototype.keepAliveAndReturnUnknownQueryIds = function (queryIds) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var repo, _loop_2, _a, _b, query, e_2_1;
            var e_2, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.repo];
                    case 1:
                        repo = _d.sent();
                        _loop_2 = function (query) {
                            return tslib_1.__generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0:
                                        query.lastUsedIso = new Date().toISOString();
                                        return [4 /*yield*/, repo.save(query)];
                                    case 1:
                                        _e.sent();
                                        queryIds = queryIds.filter(function (x) { return x !== query.id; });
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _d.label = 2;
                    case 2:
                        _d.trys.push([2, 8, 9, 10]);
                        return [4 /*yield*/, repo.find({ where: { id: queryIds } })];
                    case 3:
                        _a = tslib_1.__values.apply(void 0, [_d.sent()]), _b = _a.next();
                        _d.label = 4;
                    case 4:
                        if (!!_b.done) return [3 /*break*/, 7];
                        query = _b.value;
                        return [5 /*yield**/, _loop_2(query)];
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
                    case 10: return [2 /*return*/, queryIds];
                }
            });
        });
    };
    return DataProviderLiveQueryStorage;
}());
exports.DataProviderLiveQueryStorage = DataProviderLiveQueryStorage;
var LiveQueryStorageEntity = /** @class */ (function (_super) {
    tslib_1.__extends(LiveQueryStorageEntity, _super);
    /*@internal */
    function LiveQueryStorageEntity() {
        var _this = _super.apply(this, tslib_1.__spreadArray([], tslib_1.__read(arguments), false)) || this;
        _this.id = '';
        _this.entityKey = '';
        _this.lastUsedIso = new Date().toISOString();
        return _this;
    }
    tslib_1.__decorate([
        Fields_js_1.Fields.string(),
        tslib_1.__metadata("design:type", Object)
    ], LiveQueryStorageEntity.prototype, "id", void 0);
    tslib_1.__decorate([
        Fields_js_1.Fields.string(),
        tslib_1.__metadata("design:type", Object)
    ], LiveQueryStorageEntity.prototype, "entityKey", void 0);
    tslib_1.__decorate([
        Fields_js_1.Fields.object(),
        tslib_1.__metadata("design:type", Object)
    ], LiveQueryStorageEntity.prototype, "data", void 0);
    tslib_1.__decorate([
        Fields_js_1.Fields.string(),
        tslib_1.__metadata("design:type", Object)
    ], LiveQueryStorageEntity.prototype, "lastUsedIso", void 0);
    LiveQueryStorageEntity = tslib_1.__decorate([
        (0, entity_js_1.Entity)(undefined, {
            dbName: 'remult_live_query_storage',
        })
        /*@internal */
    ], LiveQueryStorageEntity);
    return LiveQueryStorageEntity;
}(RepositoryImplementation_js_1.EntityBase));
exports.LiveQueryStorageEntity = LiveQueryStorageEntity;
