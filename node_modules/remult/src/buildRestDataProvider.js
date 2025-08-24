"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpProviderBridgeToRestDataProviderHttpProvider = void 0;
exports.buildRestDataProvider = buildRestDataProvider;
exports.isExternalHttpProvider = isExternalHttpProvider;
exports.retry = retry;
exports.toPromise = toPromise;
exports.processHttpException = processHttpException;
var tslib_1 = require("tslib");
var rest_data_provider_js_1 = require("./data-providers/rest-data-provider.js");
var remult3_js_1 = require("./remult3/remult3.js");
function buildRestDataProvider(provider) {
    if (!provider)
        return new rest_data_provider_js_1.RestDataProviderHttpProviderUsingFetch();
    var httpDataProvider;
    if (!httpDataProvider) {
        if (isExternalHttpProvider(provider)) {
            httpDataProvider = new HttpProviderBridgeToRestDataProviderHttpProvider(provider);
        }
    }
    if (!httpDataProvider) {
        if (typeof provider === 'function') {
            httpDataProvider = new rest_data_provider_js_1.RestDataProviderHttpProviderUsingFetch(provider);
        }
    }
    return httpDataProvider;
}
function isExternalHttpProvider(item) {
    var http = item;
    if (http && http.get && http.put && http.post && http.delete)
        return true;
    return false;
}
var HttpProviderBridgeToRestDataProviderHttpProvider = /** @class */ (function () {
    function HttpProviderBridgeToRestDataProviderHttpProvider(http) {
        this.http = http;
    }
    HttpProviderBridgeToRestDataProviderHttpProvider.prototype.post = function (url, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, retry(function () { return toPromise(_this.http.post(url, data)); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    HttpProviderBridgeToRestDataProviderHttpProvider.prototype.delete = function (url) {
        return toPromise(this.http.delete(url));
    };
    HttpProviderBridgeToRestDataProviderHttpProvider.prototype.put = function (url, data) {
        return toPromise(this.http.put(url, data));
    };
    HttpProviderBridgeToRestDataProviderHttpProvider.prototype.get = function (url) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, retry(function () { return toPromise(_this.http.get(url)); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return HttpProviderBridgeToRestDataProviderHttpProvider;
}());
exports.HttpProviderBridgeToRestDataProviderHttpProvider = HttpProviderBridgeToRestDataProviderHttpProvider;
function retry(what) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var i, err_1;
        var _a, _b, _c, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    i = 0;
                    _e.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 8];
                    _e.label = 2;
                case 2:
                    _e.trys.push([2, 4, , 7]);
                    return [4 /*yield*/, what()];
                case 3: return [2 /*return*/, _e.sent()];
                case 4:
                    err_1 = _e.sent();
                    if (!((((_a = err_1.message) === null || _a === void 0 ? void 0 : _a.startsWith('Error occurred while trying to proxy')) ||
                        ((_b = err_1.message) === null || _b === void 0 ? void 0 : _b.startsWith('Error occured while trying to proxy')) ||
                        ((_c = err_1.message) === null || _c === void 0 ? void 0 : _c.includes('http proxy error')) ||
                        ((_d = err_1.message) === null || _d === void 0 ? void 0 : _d.startsWith('Gateway Timeout')) ||
                        err_1.status == 500) &&
                        i++ < remult3_js_1.flags.error500RetryCount)) return [3 /*break*/, 6];
                    return [4 /*yield*/, new Promise(function (res, req) {
                            setTimeout(function () {
                                res({});
                            }, 500);
                        })];
                case 5:
                    _e.sent();
                    return [3 /*break*/, 1];
                case 6: throw err_1;
                case 7: return [3 /*break*/, 1];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function toPromise(p) {
    var _this = this;
    var r;
    if (p['toPromise'] !== undefined) {
        r = p['toPromise']();
    }
    //@ts-ignore
    else
        r = p;
    return r
        .then(function (x) {
        if (x &&
            (x.status == 200 || x.status == 201) &&
            x.headers &&
            x.request &&
            x.data !== undefined)
            //for axios
            return x.data;
        return x;
    })
        .catch(function (ex) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, processHttpException(ex)];
                case 1: throw _a.sent();
            }
        });
    }); });
}
function processHttpException(ex) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var z, error, httpStatusCode, result;
        var _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, ex];
                case 1:
                    z = _d.sent();
                    if (z.error)
                        error = z.error;
                    else if (z.isAxiosError) {
                        if (typeof ((_a = z.response) === null || _a === void 0 ? void 0 : _a.data) === 'string')
                            error = z.response.data;
                        else
                            error = (_b = z === null || z === void 0 ? void 0 : z.response) === null || _b === void 0 ? void 0 : _b.data;
                    }
                    if (!error)
                        error = z.message;
                    if (z.status == 0 && z.error.isTrusted)
                        error = 'Network Error';
                    if (typeof error === 'string') {
                        error = {
                            message: error,
                        };
                    }
                    if (z.modelState)
                        error.modelState = z.modelState;
                    httpStatusCode = z.status;
                    if (httpStatusCode === undefined)
                        httpStatusCode = (_c = z.response) === null || _c === void 0 ? void 0 : _c.status;
                    if (httpStatusCode !== undefined && httpStatusCode !== null) {
                        error.httpStatusCode = httpStatusCode;
                    }
                    result = Object.assign(error !== null && error !== void 0 ? error : {}, {
                    //     exception: ex disabled for now because JSON.stringify crashed with this
                    });
                    return [2 /*return*/, result];
            }
        });
    });
}
