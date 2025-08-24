"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryLiveQueryStorage = exports.LiveQueryPublisher = void 0;
var tslib_1 = require("tslib");
var rest_data_provider_js_1 = require("../data-providers/rest-data-provider.js");
/* @internal*/
var LiveQueryPublisher = /** @class */ (function () {
    function LiveQueryPublisher(subscriptionServer, liveQueryStorage, performWithContext) {
        this.subscriptionServer = subscriptionServer;
        this.liveQueryStorage = liveQueryStorage;
        this.performWithContext = performWithContext;
        this.debugFileSaver = function (x) { };
    }
    LiveQueryPublisher.prototype.runPromise = function (p) { };
    LiveQueryPublisher.prototype.itemChanged = function (entityKey, changes) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.runPromise(this.liveQueryStorage().forEach(entityKey, function (_a) { return tslib_1.__awaiter(_this, [_a], void 0, function (_b) {
                            var query;
                            var _this = this;
                            var q = _b.query, setData = _b.setData;
                            return tslib_1.__generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        query = tslib_1.__assign({}, q.data);
                                        return [4 /*yield*/, this.performWithContext(query.requestJson, entityKey, function (repo) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                                var messages, currentItems, currentIds, _loop_1, _a, _b, id, _loop_2, currentItems_1, currentItems_1_1, item;
                                                var e_1, _c, e_2, _d;
                                                return tslib_1.__generator(this, function (_e) {
                                                    switch (_e.label) {
                                                        case 0:
                                                            messages = [];
                                                            return [4 /*yield*/, repo.find((0, rest_data_provider_js_1.findOptionsFromJson)(query.findOptionsJson, repo.metadata))];
                                                        case 1:
                                                            currentItems = _e.sent();
                                                            currentIds = currentItems.map(function (x) {
                                                                return repo.getEntityRef(x).getId();
                                                            });
                                                            _loop_1 = function (id) {
                                                                var c = changes.find(function (c) { return c.oldId == id; });
                                                                if (c === undefined ||
                                                                    id != c.oldId ||
                                                                    !currentIds.includes(c.id))
                                                                    messages.push({
                                                                        type: 'remove',
                                                                        data: {
                                                                            id: id,
                                                                        },
                                                                    });
                                                            };
                                                            try {
                                                                for (_a = tslib_1.__values(query.lastIds.filter(function (y) { return !currentIds.includes(y); })), _b = _a.next(); !_b.done; _b = _a.next()) {
                                                                    id = _b.value;
                                                                    _loop_1(id);
                                                                }
                                                            }
                                                            catch (e_1_1) { e_1 = { error: e_1_1 }; }
                                                            finally {
                                                                try {
                                                                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                                                                }
                                                                finally { if (e_1) throw e_1.error; }
                                                            }
                                                            _loop_2 = function (item) {
                                                                var itemRef = repo.getEntityRef(item);
                                                                var c = changes.find(function (c) { return c.id == itemRef.getId(); });
                                                                if (c !== undefined && query.lastIds.includes(c.oldId)) {
                                                                    messages.push({
                                                                        type: 'replace',
                                                                        data: {
                                                                            oldId: c.oldId,
                                                                            item: itemRef.toApiJson(),
                                                                        },
                                                                    });
                                                                }
                                                                else if (!query.lastIds.includes(itemRef.getId())) {
                                                                    messages.push({
                                                                        type: 'add',
                                                                        data: { item: itemRef.toApiJson() },
                                                                    });
                                                                }
                                                            };
                                                            try {
                                                                for (currentItems_1 = tslib_1.__values(currentItems), currentItems_1_1 = currentItems_1.next(); !currentItems_1_1.done; currentItems_1_1 = currentItems_1.next()) {
                                                                    item = currentItems_1_1.value;
                                                                    _loop_2(item);
                                                                }
                                                            }
                                                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                                                            finally {
                                                                try {
                                                                    if (currentItems_1_1 && !currentItems_1_1.done && (_d = currentItems_1.return)) _d.call(currentItems_1);
                                                                }
                                                                finally { if (e_2) throw e_2.error; }
                                                            }
                                                            this.debugFileSaver({
                                                                query: q.id,
                                                                currentIds: currentIds,
                                                                changes: changes,
                                                                lastIds: query.lastIds,
                                                                messages: messages,
                                                            });
                                                            query.lastIds = currentIds;
                                                            return [4 /*yield*/, setData(query)];
                                                        case 2:
                                                            _e.sent();
                                                            if (messages.length > 0)
                                                                this.subscriptionServer().publishMessage(q.id, messages);
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            }); })];
                                    case 1:
                                        _c.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return LiveQueryPublisher;
}());
exports.LiveQueryPublisher = LiveQueryPublisher;
var InMemoryLiveQueryStorage = /** @class */ (function () {
    function InMemoryLiveQueryStorage() {
        this.debugFileSaver = function (x) { };
        this.queries = [];
        this.removeCountForTesting = 0;
    }
    InMemoryLiveQueryStorage.prototype.debug = function () {
        this.debugFileSaver(this.queries);
    };
    InMemoryLiveQueryStorage.prototype.keepAliveAndReturnUnknownQueryIds = function (ids) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result, _loop_3, this_1, ids_1, ids_1_1, id;
            var e_3, _a;
            return tslib_1.__generator(this, function (_b) {
                result = [];
                _loop_3 = function (id) {
                    var q = this_1.queries.find(function (q) { return q.id === id; });
                    if (q) {
                        q.lastUsed = new Date().toISOString();
                    }
                    else
                        result.push(id);
                };
                this_1 = this;
                try {
                    for (ids_1 = tslib_1.__values(ids), ids_1_1 = ids_1.next(); !ids_1_1.done; ids_1_1 = ids_1.next()) {
                        id = ids_1_1.value;
                        _loop_3(id);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (ids_1_1 && !ids_1_1.done && (_a = ids_1.return)) _a.call(ids_1);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                this.debug();
                return [2 /*return*/, result];
            });
        });
    };
    InMemoryLiveQueryStorage.prototype.add = function (query) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this.queries.push(tslib_1.__assign(tslib_1.__assign({}, query), { lastUsed: new Date().toISOString() }));
                this.debug();
                return [2 /*return*/];
            });
        });
    };
    InMemoryLiveQueryStorage.prototype.remove = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this.queries = this.queries.filter(function (q) { return q.id !== id; });
                this.removeCountForTesting++;
                this.debug();
                return [2 /*return*/];
            });
        });
    };
    InMemoryLiveQueryStorage.prototype.forEach = function (entityKey, handle) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var d, _loop_4, _a, _b, q, e_4_1;
            var e_4, _c;
            var _this = this;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        d = new Date();
                        d.setMinutes(d.getMinutes() - 5);
                        this.queries = this.queries.filter(function (x) { return x.lastUsed > d.toISOString(); });
                        _loop_4 = function (q) {
                            return tslib_1.__generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0:
                                        if (!(q.entityKey === entityKey)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, handle({
                                                query: q,
                                                setData: function (data) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                                    return tslib_1.__generator(this, function (_a) {
                                                        q.data = data;
                                                        return [2 /*return*/];
                                                    });
                                                }); },
                                            })];
                                    case 1:
                                        _e.sent();
                                        _e.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        };
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 6, 7, 8]);
                        _a = tslib_1.__values(this.queries), _b = _a.next();
                        _d.label = 2;
                    case 2:
                        if (!!_b.done) return [3 /*break*/, 5];
                        q = _b.value;
                        return [5 /*yield**/, _loop_4(q)];
                    case 3:
                        _d.sent();
                        _d.label = 4;
                    case 4:
                        _b = _a.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_4_1 = _d.sent();
                        e_4 = { error: e_4_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_4) throw e_4.error; }
                        return [7 /*endfinally*/];
                    case 8:
                        this.debug();
                        return [2 /*return*/];
                }
            });
        });
    };
    return InMemoryLiveQueryStorage;
}());
exports.InMemoryLiveQueryStorage = InMemoryLiveQueryStorage;
