"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AblySubscriptionServer = exports.AblySubscriptionClient = void 0;
var tslib_1 = require("tslib");
var AblySubscriptionClient = /** @class */ (function () {
    function AblySubscriptionClient(ably) {
        this.ably = ably;
    }
    AblySubscriptionClient.prototype.openConnection = function (onReconnect) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, {
                        close: function () {
                            // Since we did not open the connection, we do not close it
                        },
                        subscribe: function (channel, handler) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var myHandler;
                            var _this = this;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        myHandler = function (y) { return handler(y.data); };
                                        return [4 /*yield*/, this.ably.channels.get(channel).subscribe(function (y) { return myHandler(y); })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/, function () {
                                                myHandler = function () { };
                                                _this.ably.channels.get(channel).unsubscribe();
                                            }];
                                }
                            });
                        }); },
                    }];
            });
        });
    };
    return AblySubscriptionClient;
}());
exports.AblySubscriptionClient = AblySubscriptionClient;
var AblySubscriptionServer = /** @class */ (function () {
    function AblySubscriptionServer(ably) {
        this.ably = ably;
    }
    AblySubscriptionServer.prototype.publishMessage = function (channel, message) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ably.channels.get(channel).publish({ data: message })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return AblySubscriptionServer;
}());
exports.AblySubscriptionServer = AblySubscriptionServer;
