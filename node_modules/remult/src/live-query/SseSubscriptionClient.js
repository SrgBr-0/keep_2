"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionNotFoundError = exports.SseSubscriptionClient = void 0;
var tslib_1 = require("tslib");
var buildRestDataProvider_js_1 = require("../buildRestDataProvider.js");
var remult_proxy_js_1 = require("../remult-proxy.js");
var remult_static_js_1 = require("../remult-static.js");
var remult3_js_1 = require("../remult3/remult3.js");
var SubscriptionChannel_js_1 = require("./SubscriptionChannel.js");
var SseSubscriptionClient = /** @class */ (function () {
    function SseSubscriptionClient() {
    }
    SseSubscriptionClient.prototype.openConnection = function (onReconnect) {
        var connectionId;
        var channels = new Map();
        var provider = (0, buildRestDataProvider_js_1.buildRestDataProvider)(remult_proxy_js_1.remult.apiClient.httpClient);
        var connected = false;
        var source;
        var client = {
            close: function () {
                source.close();
            },
            subscribe: function (channel, handler) {
                return tslib_1.__awaiter(this, void 0, void 0, function () {
                    var listeners;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                listeners = channels.get(channel);
                                if (!!listeners) return [3 /*break*/, 2];
                                channels.set(channel, (listeners = []));
                                return [4 /*yield*/, subscribeToChannel(channel)];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2:
                                listeners.push(handler);
                                return [2 /*return*/, function () {
                                        listeners.splice(listeners.indexOf(handler, 1));
                                        if (listeners.length == 0) {
                                            remult_static_js_1.remultStatic.actionInfo.runActionWithoutBlockingUI(function () {
                                                return provider.post(remult_proxy_js_1.remult.apiClient.url + '/' + SubscriptionChannel_js_1.streamUrl + '/unsubscribe', {
                                                    channel: channel,
                                                    clientId: connectionId,
                                                });
                                            });
                                            channels.delete(channel);
                                        }
                                    }];
                        }
                    });
                });
            },
        };
        var createConnectionPromise = function () {
            return new Promise(function (res) {
                createConnection();
                var retryCount = 0;
                function createConnection() {
                    var _this = this;
                    if (source)
                        source.close();
                    source = SseSubscriptionClient.createEventSource(remult_proxy_js_1.remult.apiClient.url + '/' + SubscriptionChannel_js_1.streamUrl);
                    source.onmessage = function (e) {
                        var message = JSON.parse(e.data);
                        var listeners = channels.get(message.channel);
                        if (listeners)
                            listeners.forEach(function (x) { return x(message.data); });
                    };
                    source.onerror = function (e) {
                        console.error('Live Query Event Source Error', e);
                        source.close();
                        if (retryCount++ < remult3_js_1.flags.error500RetryCount) {
                            setTimeout(function () {
                                createConnection();
                            }, 500);
                        }
                    };
                    source.addEventListener('connectionId', function (e) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var _a, _b, channel, e_1_1;
                        var e_1, _c;
                        return tslib_1.__generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    //@ts-ignore
                                    connectionId = e.data;
                                    if (!connected) return [3 /*break*/, 9];
                                    _d.label = 1;
                                case 1:
                                    _d.trys.push([1, 6, 7, 8]);
                                    _a = tslib_1.__values(channels.keys()), _b = _a.next();
                                    _d.label = 2;
                                case 2:
                                    if (!!_b.done) return [3 /*break*/, 5];
                                    channel = _b.value;
                                    return [4 /*yield*/, subscribeToChannel(channel)];
                                case 3:
                                    _d.sent();
                                    _d.label = 4;
                                case 4:
                                    _b = _a.next();
                                    return [3 /*break*/, 2];
                                case 5: return [3 /*break*/, 8];
                                case 6:
                                    e_1_1 = _d.sent();
                                    e_1 = { error: e_1_1 };
                                    return [3 /*break*/, 8];
                                case 7:
                                    try {
                                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                                    }
                                    finally { if (e_1) throw e_1.error; }
                                    return [7 /*endfinally*/];
                                case 8:
                                    onReconnect();
                                    return [3 /*break*/, 10];
                                case 9:
                                    connected = true;
                                    res(client);
                                    _d.label = 10;
                                case 10: return [2 /*return*/];
                            }
                        });
                    }); });
                }
            });
        };
        return createConnectionPromise();
        function subscribeToChannel(channel) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var result;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, remult_static_js_1.remultStatic.actionInfo.runActionWithoutBlockingUI(function () {
                                return provider.post(remult_proxy_js_1.remult.apiClient.url + '/' + SubscriptionChannel_js_1.streamUrl + '/subscribe', {
                                    channel: channel,
                                    clientId: connectionId,
                                });
                            })];
                        case 1:
                            result = _a.sent();
                            if (!(result === exports.ConnectionNotFoundError)) return [3 /*break*/, 3];
                            return [4 /*yield*/, createConnectionPromise()];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    };
    SseSubscriptionClient.createEventSource = function (url) {
        return new EventSource(url, {
            withCredentials: true,
        });
    };
    return SseSubscriptionClient;
}());
exports.SseSubscriptionClient = SseSubscriptionClient;
exports.ConnectionNotFoundError = 'client connection not found';
