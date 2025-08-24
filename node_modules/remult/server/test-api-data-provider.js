"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestApiDataProvider = TestApiDataProvider;
var tslib_1 = require("tslib");
var index_js_1 = require("../index.js");
var remult_api_server_js_1 = require("./remult-api-server.js");
var remult_static_js_1 = require("../src/remult-static.js");
var context_js_1 = require("../src/context.js");
var initDataProvider_js_1 = require("./initDataProvider.js");
function TestApiDataProvider(options) {
    var _this = this;
    if (!options)
        options = {};
    var dp = (0, initDataProvider_js_1.initDataProvider)(options.dataProvider, false, function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, new index_js_1.InMemoryDataProvider()];
        });
    }); });
    var server = (0, remult_api_server_js_1.createRemultServerCore)(tslib_1.__assign(tslib_1.__assign({}, options), { dataProvider: dp }), {
        getRequestBody: function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, req.body];
        }); }); },
        buildGenericRequestInfo: function (req) { return req; },
        ignoreAsyncStorage: true,
    });
    function handleOnServer(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, MakeServerCallWithDifferentStaticRemult(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var result;
                            var _a, _b, _c, _d;
                            return tslib_1.__generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0:
                                        if (!(newEntities.length > 0 && (options === null || options === void 0 ? void 0 : options.ensureSchema) != false)) return [3 /*break*/, 3];
                                        return [4 /*yield*/, dp];
                                    case 1: return [4 /*yield*/, ((_b = (_a = (_e.sent())).ensureSchema) === null || _b === void 0 ? void 0 : _b.call(_a, newEntities))];
                                    case 2:
                                        _e.sent();
                                        newEntities = [];
                                        _e.label = 3;
                                    case 3: return [4 /*yield*/, server.handle(req)];
                                    case 4:
                                        result = _e.sent();
                                        if (((_c = result === null || result === void 0 ? void 0 : result.statusCode) !== null && _c !== void 0 ? _c : 200) >= 400) {
                                            throw tslib_1.__assign(tslib_1.__assign({}, result === null || result === void 0 ? void 0 : result.data), { status: (_d = result === null || result === void 0 ? void 0 : result.statusCode) !== null && _d !== void 0 ? _d : 500 });
                                        }
                                        return [2 /*return*/, result === null || result === void 0 ? void 0 : result.data];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
    var registeredEntities = new Set();
    var newEntities = [];
    return new index_js_1.RestDataProvider(function () { return ({
        httpClient: {
            get: function (url) {
                return handleOnServer({
                    url: url,
                    method: 'GET',
                });
            },
            put: function (url, body) {
                return handleOnServer({
                    method: 'PUT',
                    url: url,
                    body: body,
                });
            },
            post: function (url, body) {
                return handleOnServer({
                    method: 'POST',
                    url: url,
                    body: body,
                });
            },
            delete: function (url) {
                return handleOnServer({
                    method: 'DELETE',
                    url: url,
                });
            },
        },
    }); }, function (entity) {
        if (!registeredEntities.has(entity.key)) {
            registeredEntities.add(entity.key);
            server.__addEntityForTesting(entity);
            newEntities.push(entity);
        }
    });
}
function MakeServerCallWithDifferentStaticRemult(what) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var x, y, user, store;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    x = remult_static_js_1.remultStatic.asyncContext;
                    y = remult_static_js_1.remultStatic.remultFactory;
                    user = tslib_1.__assign({}, index_js_1.remult.user);
                    remult_static_js_1.remultStatic.remultFactory = function () { return store.remult; };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    remult_static_js_1.remultStatic.asyncContext = new context_js_1.RemultAsyncLocalStorage({
                        getStore: function () { return store; },
                        run: function (pStore, callback) {
                            store = pStore;
                            store.remult.user = user;
                            return callback();
                        },
                        wasImplemented: 'yes',
                    });
                    return [4 /*yield*/, what()];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    remult_static_js_1.remultStatic.asyncContext = x;
                    remult_static_js_1.remultStatic.remultFactory = y;
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    });
}
