"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestApiDataProvider = exports.JsonFileDataProvider = exports.JsonEntityFileStorage = exports.DataProviderLiveQueryStorage = exports.SseSubscriptionServer = void 0;
exports.createRemultServer = createRemultServer;
var tslib_1 = require("tslib");
var remult_api_server_js_1 = require("./remult-api-server.js");
var initAsyncHooks_js_1 = require("./initAsyncHooks.js");
var isOfType_js_1 = require("../src/isOfType.js");
var SseSubscriptionServer_js_1 = require("../SseSubscriptionServer.js");
Object.defineProperty(exports, "SseSubscriptionServer", { enumerable: true, get: function () { return SseSubscriptionServer_js_1.SseSubscriptionServer; } });
var data_provider_live_query_storage_js_1 = require("../live-query/data-provider-live-query-storage.js");
Object.defineProperty(exports, "DataProviderLiveQueryStorage", { enumerable: true, get: function () { return data_provider_live_query_storage_js_1.DataProviderLiveQueryStorage; } });
var JsonEntityFileStorage_js_1 = require("./JsonEntityFileStorage.js");
Object.defineProperty(exports, "JsonEntityFileStorage", { enumerable: true, get: function () { return JsonEntityFileStorage_js_1.JsonEntityFileStorage; } });
Object.defineProperty(exports, "JsonFileDataProvider", { enumerable: true, get: function () { return JsonEntityFileStorage_js_1.JsonFileDataProvider; } });
var test_api_data_provider_js_1 = require("./test-api-data-provider.js");
Object.defineProperty(exports, "TestApiDataProvider", { enumerable: true, get: function () { return test_api_data_provider_js_1.TestApiDataProvider; } });
function createRemultServer(options, serverCoreOptions) {
    var _this = this;
    (0, initAsyncHooks_js_1.initAsyncHooks)();
    return (0, remult_api_server_js_1.createRemultServerCore)(options, serverCoreOptions || {
        buildGenericRequestInfo: function (req) { return (0, isOfType_js_1.cast)(req, 'method'); },
        getRequestBody: function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, req.body];
        }); }); },
    });
}
