"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveQueryClient = void 0;
var tslib_1 = require("tslib");
var buildRestDataProvider_js_1 = require("../buildRestDataProvider.js");
var rest_data_provider_js_1 = require("../data-providers/rest-data-provider.js");
var remult_static_js_1 = require("../remult-static.js");
var repository_internals_js_1 = require("../remult3/repository-internals.js");
var SubscriptionChannel_js_1 = require("./SubscriptionChannel.js");
/* @internal*/
var LiveQueryClient = /** @class */ (function () {
    function LiveQueryClient(apiProvider, getUserId) {
        this.apiProvider = apiProvider;
        this.getUserId = getUserId;
        this.queries = new Map();
        this.channels = new Map();
    }
    LiveQueryClient.prototype.wrapMessageHandling = function (handleMessage) {
        var x = this.apiProvider().wrapMessageHandling;
        if (x)
            x(handleMessage);
        else
            handleMessage();
    };
    LiveQueryClient.prototype.hasQueriesForTesting = function () {
        return this.queries.size > 0;
    };
    LiveQueryClient.prototype.runPromise = function (p) {
        return p;
    };
    LiveQueryClient.prototype.close = function () {
        this.queries.clear();
        this.channels.clear();
        this.closeIfNoListeners();
    };
    LiveQueryClient.prototype.subscribeChannel = function (key, onResult) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var onUnsubscribe, client, q_1, _a, err_1, err_2;
            var _this = this;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        onUnsubscribe = function () { };
                        return [4 /*yield*/, this.openIfNoOpened()];
                    case 1:
                        client = _b.sent();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 7, , 8]);
                        q_1 = this.channels.get(key);
                        if (!!q_1) return [3 /*break*/, 6];
                        this.channels.set(key, (q_1 = new MessageChannel()));
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 5, , 6]);
                        _a = q_1;
                        return [4 /*yield*/, client.subscribe(key, function (value) { return _this.wrapMessageHandling(function () { return q_1.handle(value); }); }, function (err) {
                                onResult.error(err);
                            })];
                    case 4:
                        _a.unsubscribe = _b.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        err_1 = _b.sent();
                        onResult.error(err_1);
                        throw err_1;
                    case 6:
                        q_1.listeners.push(onResult);
                        onUnsubscribe = function () {
                            q_1.listeners.splice(q_1.listeners.indexOf(onResult), 1);
                            if (q_1.listeners.length == 0) {
                                _this.channels.delete(key);
                                q_1.unsubscribe();
                            }
                            _this.closeIfNoListeners();
                        };
                        return [3 /*break*/, 8];
                    case 7:
                        err_2 = _b.sent();
                        onResult.error(err_2);
                        throw err_2;
                    case 8: return [2 /*return*/, function () {
                            onUnsubscribe();
                            onUnsubscribe = function () { };
                        }];
                }
            });
        });
    };
    LiveQueryClient.prototype.closeIfNoListeners = function () {
        if (this.client)
            if (this.queries.size === 0 && this.channels.size === 0) {
                this.runPromise(this.client.then(function (x) { return x.close(); }));
                this.client = undefined;
                clearInterval(this.interval);
                this.interval = undefined;
            }
    };
    LiveQueryClient.prototype.subscribe = function (repo, options, listener) {
        var _this = this;
        var alive = true;
        var onUnsubscribe = function () {
            alive = false;
        };
        this.runPromise((0, repository_internals_js_1.getRepositoryInternals)(repo)
            ._buildEntityDataProviderFindOptions(options)
            .then(function (opts) {
            if (!alive)
                return;
            var _a = new rest_data_provider_js_1.RestDataProvider(_this.apiProvider)
                .getEntityDataProvider(repo.metadata)
                .buildFindRequest(opts), createKey = _a.createKey, subscribe = _a.subscribe;
            var eventTypeKey = createKey();
            var q = _this.queries.get(eventTypeKey);
            if (!q) {
                _this.queries.set(eventTypeKey, (q = new SubscriptionChannel_js_1.LiveQuerySubscriber(repo, { entityKey: repo.metadata.key, options: options }, _this.getUserId())));
                q.subscribeCode = function () {
                    if (q.unsubscribe) {
                        q.unsubscribe();
                        q.unsubscribe = function () { };
                    }
                    _this.runPromise(_this.subscribeChannel(q.queryChannel, {
                        next: function (value) { return _this.runPromise(q.handle(value)); },
                        complete: function () { },
                        error: function (er) {
                            q.listeners.forEach(function (l) { return l.error(er); });
                        },
                    }).then(function (unsubscribeToChannel) {
                        if (q.listeners.length == 0) {
                            unsubscribeToChannel();
                            return;
                        }
                        _this.runPromise(subscribe(q.queryChannel)
                            .then(function (r) {
                            if (q.listeners.length === 0) {
                                r.unsubscribe();
                                unsubscribeToChannel();
                                return;
                            }
                            _this.runPromise(q.setAllItems(r.result));
                            q.unsubscribe = function () {
                                q.unsubscribe = function () { };
                                unsubscribeToChannel();
                                _this.runPromise(r.unsubscribe());
                            };
                        })
                            .catch(function (err) {
                            q.listeners.forEach(function (l) { return l.error(err); });
                            unsubscribeToChannel();
                            _this.queries.delete(eventTypeKey);
                        }));
                    })).catch(function (err) {
                        q.listeners.forEach(function (l) { return l.error(err); });
                    });
                };
                q.subscribeCode();
            }
            else {
                q.sendDefaultState(listener.next);
            }
            q.listeners.push(listener);
            onUnsubscribe = function () {
                q.listeners.splice(q.listeners.indexOf(listener), 1);
                listener.complete();
                if (q.listeners.length == 0) {
                    _this.queries.delete(eventTypeKey);
                    q.unsubscribe();
                }
                _this.closeIfNoListeners();
            };
        })
            .catch(function (err) {
            listener.error(err);
        }));
        return function () {
            onUnsubscribe();
        };
    };
    LiveQueryClient.prototype.openIfNoOpened = function () {
        var _this = this;
        if (!this.client) {
            this.interval = setInterval(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var ids, _a, _b, q, p_1, invalidIds, _c, invalidIds_1, invalidIds_1_1, id, _d, _e, q;
                var e_1, _f, e_2, _g, e_3, _h;
                return tslib_1.__generator(this, function (_j) {
                    switch (_j.label) {
                        case 0:
                            ids = [];
                            try {
                                for (_a = tslib_1.__values(this.queries.values()), _b = _a.next(); !_b.done; _b = _a.next()) {
                                    q = _b.value;
                                    ids.push(q.queryChannel);
                                }
                            }
                            catch (e_1_1) { e_1 = { error: e_1_1 }; }
                            finally {
                                try {
                                    if (_b && !_b.done && (_f = _a.return)) _f.call(_a);
                                }
                                finally { if (e_1) throw e_1.error; }
                            }
                            if (!(ids.length > 0)) return [3 /*break*/, 3];
                            p_1 = this.apiProvider();
                            _c = this.runPromise;
                            return [4 /*yield*/, remult_static_js_1.remultStatic.actionInfo.runActionWithoutBlockingUI(function () {
                                    return (0, buildRestDataProvider_js_1.buildRestDataProvider)(p_1.httpClient).post(p_1.url + '/' + SubscriptionChannel_js_1.liveQueryKeepAliveRoute, ids);
                                })];
                        case 1: return [4 /*yield*/, _c.apply(this, [_j.sent()])];
                        case 2:
                            invalidIds = _j.sent();
                            try {
                                for (invalidIds_1 = tslib_1.__values(invalidIds), invalidIds_1_1 = invalidIds_1.next(); !invalidIds_1_1.done; invalidIds_1_1 = invalidIds_1.next()) {
                                    id = invalidIds_1_1.value;
                                    try {
                                        for (_d = (e_3 = void 0, tslib_1.__values(this.queries.values())), _e = _d.next(); !_e.done; _e = _d.next()) {
                                            q = _e.value;
                                            if (q.queryChannel === id)
                                                q.subscribeCode();
                                        }
                                    }
                                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                                    finally {
                                        try {
                                            if (_e && !_e.done && (_h = _d.return)) _h.call(_d);
                                        }
                                        finally { if (e_3) throw e_3.error; }
                                    }
                                }
                            }
                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                            finally {
                                try {
                                    if (invalidIds_1_1 && !invalidIds_1_1.done && (_g = invalidIds_1.return)) _g.call(invalidIds_1);
                                }
                                finally { if (e_2) throw e_2.error; }
                            }
                            _j.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            }); }, 30000);
            return this.runPromise((this.client = this.apiProvider().subscriptionClient.openConnection(function () {
                var e_4, _a;
                try {
                    for (var _b = tslib_1.__values(_this.queries.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var q = _c.value;
                        q.subscribeCode();
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
            })));
        }
        return this.client;
    };
    return LiveQueryClient;
}());
exports.LiveQueryClient = LiveQueryClient;
var MessageChannel = /** @class */ (function () {
    function MessageChannel() {
        this.unsubscribe = function () { };
        this.listeners = [];
    }
    MessageChannel.prototype.handle = function (message) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, _b, l;
            var e_5, _c;
            return tslib_1.__generator(this, function (_d) {
                try {
                    for (_a = tslib_1.__values(this.listeners), _b = _a.next(); !_b.done; _b = _a.next()) {
                        l = _b.value;
                        l.next(message);
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
                return [2 /*return*/];
            });
        });
    };
    return MessageChannel;
}());
