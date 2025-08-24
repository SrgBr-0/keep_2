"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncLocalStorageBridgeToRemultAsyncLocalStorageCore = exports.StubRemultAsyncLocalStorageCore = exports.AsyncLocalStorageBridgeToRemultAsyncLocalStorageCoreImpl = void 0;
exports.initAsyncHooks = initAsyncHooks;
var tslib_1 = require("tslib");
var async_hooks_1 = require("async_hooks");
var context_js_1 = require("../src/context.js");
var remult_static_js_1 = require("../src/remult-static.js");
var init = false;
function initAsyncHooks() {
    var _this = this;
    if (init)
        return;
    init = true;
    remult_static_js_1.remultStatic.asyncContext = new context_js_1.RemultAsyncLocalStorage(new AsyncLocalStorageBridgeToRemultAsyncLocalStorageCore());
    var test = new async_hooks_1.AsyncLocalStorage();
    test.run(1, function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve()];
                case 1:
                    _a.sent();
                    if (test.getStore() === undefined) {
                        console.log("async_hooks.AsyncLocalStorage not working, using stub implementation (You're probably running on stackblitz, this will work on a normal nodejs environment)");
                        remult_static_js_1.remultStatic.asyncContext = new context_js_1.RemultAsyncLocalStorage(new StubRemultAsyncLocalStorageCore());
                    }
                    return [2 /*return*/];
            }
        });
    }); });
}
var AsyncLocalStorageBridgeToRemultAsyncLocalStorageCoreImpl = /** @class */ (function () {
    function AsyncLocalStorageBridgeToRemultAsyncLocalStorageCoreImpl() {
        this.asyncLocalStorage = new async_hooks_1.AsyncLocalStorage();
        this.wasImplemented = 'yes';
    }
    AsyncLocalStorageBridgeToRemultAsyncLocalStorageCoreImpl.prototype.run = function (store, callback) {
        var _this = this;
        var r;
        this.asyncLocalStorage.run(store, function () {
            r = new Promise(function (res, rej) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, err_1;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            _a = res;
                            return [4 /*yield*/, callback()];
                        case 1:
                            _a.apply(void 0, [_b.sent()]);
                            return [3 /*break*/, 3];
                        case 2:
                            err_1 = _b.sent();
                            rej(err_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
        });
        return r;
    };
    AsyncLocalStorageBridgeToRemultAsyncLocalStorageCoreImpl.prototype.getStore = function () {
        return this.asyncLocalStorage.getStore();
    };
    return AsyncLocalStorageBridgeToRemultAsyncLocalStorageCoreImpl;
}());
exports.AsyncLocalStorageBridgeToRemultAsyncLocalStorageCoreImpl = AsyncLocalStorageBridgeToRemultAsyncLocalStorageCoreImpl;
var StubRemultAsyncLocalStorageCore = /** @class */ (function () {
    function StubRemultAsyncLocalStorageCore() {
        this.isStub = true;
        this.wasImplemented = 'yes';
        this.lastPromise = Promise.resolve(undefined);
    }
    StubRemultAsyncLocalStorageCore.prototype.run = function (store, callback) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.currentValue = store;
                        return [4 /*yield*/, callback()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    StubRemultAsyncLocalStorageCore.prototype.getStore = function () {
        return this.currentValue;
    };
    return StubRemultAsyncLocalStorageCore;
}());
exports.StubRemultAsyncLocalStorageCore = StubRemultAsyncLocalStorageCore;
var AsyncLocalStorageBridgeToRemultAsyncLocalStorageCore = /** @class */ (function (_super) {
    tslib_1.__extends(AsyncLocalStorageBridgeToRemultAsyncLocalStorageCore, _super);
    function AsyncLocalStorageBridgeToRemultAsyncLocalStorageCore() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AsyncLocalStorageBridgeToRemultAsyncLocalStorageCore;
}(AsyncLocalStorageBridgeToRemultAsyncLocalStorageCoreImpl));
exports.AsyncLocalStorageBridgeToRemultAsyncLocalStorageCore = AsyncLocalStorageBridgeToRemultAsyncLocalStorageCore;
