"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionChannel = exports.liveQueryKeepAliveRoute = exports.LiveQuerySubscriber = exports.streamUrl = void 0;
var tslib_1 = require("tslib");
var uuid_1 = require("uuid");
var sort_js_1 = require("../sort.js");
var remult_proxy_js_1 = require("../remult-proxy.js");
var repository_internals_js_1 = require("../remult3/repository-internals.js");
exports.streamUrl = 'stream';
//@internal
var LiveQuerySubscriber = /** @class */ (function () {
    function LiveQuerySubscriber(repo, query, userId) {
        this.repo = repo;
        this.query = query;
        this.unsubscribe = function () { };
        this.defaultQueryState = [];
        this.listeners = [];
        this.id = (0, uuid_1.v4)();
        this.queryChannel = "users:".concat(userId, ":queries:").concat(this.id);
        this.id = this.queryChannel;
    }
    LiveQuerySubscriber.prototype.sendDefaultState = function (onResult) {
        var _this = this;
        onResult(this.createReducerType(function () { return tslib_1.__spreadArray([], tslib_1.__read(_this.defaultQueryState), false); }, this.allItemsMessage(this.defaultQueryState)));
    };
    LiveQuerySubscriber.prototype.setAllItems = function (result) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var items;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, repository_internals_js_1.getRepositoryInternals)(this.repo)._fromJsonArray(result, this.query.options)];
                    case 1:
                        items = _a.sent();
                        this.forListeners(function (listener) {
                            listener(function () {
                                return items;
                            });
                        }, this.allItemsMessage(items));
                        return [2 /*return*/];
                }
            });
        });
    };
    LiveQuerySubscriber.prototype.allItemsMessage = function (items) {
        return [
            {
                type: 'all',
                data: items,
            },
        ];
    };
    LiveQuerySubscriber.prototype.forListeners = function (what, changes) {
        var e_1, _a;
        var _this = this;
        what(function (reducer) {
            _this.defaultQueryState = reducer(_this.defaultQueryState);
            if (changes.find(function (c) { return c.type === 'add' || c.type === 'replace'; })) {
                if (_this.query.options.orderBy) {
                    var o_1 = sort_js_1.Sort.translateOrderByToSort(_this.repo.metadata, _this.query.options.orderBy);
                    _this.defaultQueryState.sort(function (a, b) { return o_1.compare(a, b); });
                }
            }
        });
        var _loop_1 = function (l) {
            what(function (reducer) {
                l.next(_this.createReducerType(reducer, changes));
            });
        };
        try {
            for (var _b = tslib_1.__values(this.listeners), _c = _b.next(); !_c.done; _c = _b.next()) {
                var l = _c.value;
                _loop_1(l);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    LiveQuerySubscriber.prototype.createReducerType = function (applyChanges, changes) {
        return {
            applyChanges: applyChanges,
            changes: changes,
            items: this.defaultQueryState,
        };
    };
    LiveQuerySubscriber.prototype.handle = function (messages) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var x, loadedItems, index, element;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        x = messages.filter(function (_a) {
                            var type = _a.type;
                            return type == 'add' || type == 'replace';
                        });
                        return [4 /*yield*/, (0, repository_internals_js_1.getRepositoryInternals)(this.repo)._fromJsonArray(x.map(function (m) { return m.data.item; }), this.query.options)];
                    case 1:
                        loadedItems = _a.sent();
                        for (index = 0; index < x.length; index++) {
                            element = x[index];
                            element.data.item = loadedItems[index];
                        }
                        this.forListeners(function (listener) {
                            listener(function (items) {
                                var e_2, _a;
                                if (!items)
                                    items = [];
                                var _loop_2 = function (message) {
                                    switch (message.type) {
                                        case 'all':
                                            _this.setAllItems(message.data);
                                            break;
                                        case 'replace': {
                                            items = items.map(function (x) {
                                                return _this.repo.metadata.idMetadata.getId(x) === message.data.oldId
                                                    ? message.data.item
                                                    : x;
                                            });
                                            break;
                                        }
                                        case 'add':
                                            items = items.filter(function (x) {
                                                return _this.repo.metadata.idMetadata.getId(x) !==
                                                    _this.repo.metadata.idMetadata.getId(message.data.item);
                                            });
                                            items.push(message.data.item);
                                            break;
                                        case 'remove':
                                            items = items.filter(function (x) {
                                                return _this.repo.metadata.idMetadata.getId(x) !== message.data.id;
                                            });
                                            break;
                                    }
                                };
                                try {
                                    for (var messages_1 = tslib_1.__values(messages), messages_1_1 = messages_1.next(); !messages_1_1.done; messages_1_1 = messages_1.next()) {
                                        var message = messages_1_1.value;
                                        _loop_2(message);
                                    }
                                }
                                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                                finally {
                                    try {
                                        if (messages_1_1 && !messages_1_1.done && (_a = messages_1.return)) _a.call(messages_1);
                                    }
                                    finally { if (e_2) throw e_2.error; }
                                }
                                return items;
                            });
                        }, messages);
                        return [2 /*return*/];
                }
            });
        });
    };
    return LiveQuerySubscriber;
}());
exports.LiveQuerySubscriber = LiveQuerySubscriber;
exports.liveQueryKeepAliveRoute = '_liveQueryKeepAlive';
/**
 * The `SubscriptionChannel` class is used to send messages from the backend to the frontend,
 * using the same mechanism used by live queries.
 *
 * @template messageType The type of the message that the channel will handle.
 * @example
 * // Defined in code that is shared between the frontend and the backend
 * const statusChange = new SubscriptionChannel<{ oldStatus: number, newStatus: number }>("statusChange");
 *
 * // Backend: Publishing a message
 * statusChange.publish({ oldStatus: 1, newStatus: 2 });
 *
 * // Frontend: Subscribing to messages
 * statusChange.subscribe((message) => {
 *     console.log(`Status changed from ${message.oldStatus} to ${message.newStatus}`);
 * });
 *
 * // Note: If you want to publish from the frontend, use a BackendMethod for that.
 */
var SubscriptionChannel = /** @class */ (function () {
    /**
     * Constructs a new `SubscriptionChannel` instance.
     *
     * @param {string} channelKey The key that identifies the channel.
     */
    function SubscriptionChannel(channelKey) {
        this.channelKey = channelKey;
    }
    /**
     * Publishes a message to the channel. This method should only be used on the backend.
     *
     * @param {messageType} message The message to be published.
     * @param {Remult} [remult] An optional instance of Remult to use for publishing the message.
     */
    SubscriptionChannel.prototype.publish = function (message, remult) {
        remult = remult || remult_proxy_js_1.remult;
        remult.subscriptionServer.publishMessage(this.channelKey, message);
    };
    //@internal
    SubscriptionChannel.prototype.subscribe = function (next, remult) {
        var _a, _b;
        remult = remult || remult_proxy_js_1.remult;
        var listener = next;
        if (typeof next === 'function') {
            listener = {
                next: next,
            };
        }
        (_a = listener.error) !== null && _a !== void 0 ? _a : (listener.error = function () { });
        (_b = listener.complete) !== null && _b !== void 0 ? _b : (listener.complete = function () { });
        return remult.liveQuerySubscriber.subscribeChannel(this.channelKey, listener);
    };
    return SubscriptionChannel;
}());
exports.SubscriptionChannel = SubscriptionChannel;
//TODO2 - consider moving the queued job mechanism into this.
